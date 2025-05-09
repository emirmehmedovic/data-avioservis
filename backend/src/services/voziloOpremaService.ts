import { VoziloOprema, VoziloOpremaAttributes, StatusVozila, Firma, Lokacija } from '../models';
import { AppError } from '../utils/AppError';
import { Op, Sequelize } from 'sequelize'; // Za kompleksnije upite ako zatreba
import { addMonths, differenceInDays, isValid, parseISO, addYears } from 'date-fns';

// --- DTOs (Data Transfer Objects) ---
// Za kreiranje - sva obavezna polja iz modela, osim auto-generiranih
// Opcionalna polja su definirana kao opcionalna i u DTO-u
export interface CreateVoziloOpremaDto extends Omit<VoziloOpremaAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
  status?: StatusVozila; // Status može biti poslan, inače default iz modela
}

// Za ažuriranje - sva polja su opcionalna
export interface UpdateVoziloOpremaDto extends Partial<CreateVoziloOpremaDto> {}

// --- Pomoćne funkcije za izračunavanje datuma ---
const izracunajDatumIstekaFiltera = (vozilo: VoziloOpremaAttributes): Date | null => {
  if (vozilo.datum_isteka_filtera_rucno && isValid(new Date(vozilo.datum_isteka_filtera_rucno))) {
    return new Date(vozilo.datum_isteka_filtera_rucno);
  }
  if (vozilo.datum_ugradnje_filtera && vozilo.period_vazenja_filtera_mjeseci && isValid(new Date(vozilo.datum_ugradnje_filtera))) {
    return addMonths(new Date(vozilo.datum_ugradnje_filtera), vozilo.period_vazenja_filtera_mjeseci);
  }
  return null;
};

const daniDoDatuma = (datum: Date | string | null): number | null => {
  if (!datum) return null;
  const validanDatum = typeof datum === 'string' ? parseISO(datum) : datum;
  if (!isValid(validanDatum)) return null;
  return differenceInDays(validanDatum, new Date());
};

// Pomoćna funkcija za dodavanje perioda na datum i izračunavanje dana
const izracunajDaneDoIsteka = (pocetniDatum: Date | string | null, interval: number, jedinica: 'years' | 'months'): number | null => {
  if (!pocetniDatum) return null;
  const validanPocetniDatum = typeof pocetniDatum === 'string' ? parseISO(pocetniDatum) : pocetniDatum;
  if (!isValid(validanPocetniDatum)) return null;

  let datumIsteka: Date;
  if (jedinica === 'years') {
    datumIsteka = addYears(validanPocetniDatum, interval);
  } else {
    datumIsteka = addMonths(validanPocetniDatum, interval);
  }

  return daniDoDatuma(datumIsteka);
};

// --- Funkcija za obogaćivanje objekta vozila s izračunatim poljima ---
// TypeScript tip za vozilo s izračunatim poljima
export interface VoziloOpremaSaIzracunatimPoljima extends VoziloOpremaAttributes {
  datum_isteka_filtera_izracunat?: Date | null;
  dana_do_zamjene_filtera?: number | null;
  dana_do_godisnje_inspekcije?: number | null;
  dana_do_zamjene_crijeva_hd_63?: number | null;
  dana_do_zamjene_crijeva_hd_38?: number | null;
  dana_do_zamjene_crijeva_tw_75?: number | null;
  dana_do_ispitivanja_crijeva_nepropusnost?: number | null;
  dana_do_kalibracije_senzora?: number | null;
  dana_do_kalibracije_volumetra?: number | null;
  dana_do_umjeravanja_manometara?: number | null;
  dana_do_ispitivanja_hecpv_ilcpv?: number | null;
}

const dodajIzracunataPolja = (voziloData: VoziloOpremaAttributes): VoziloOpremaSaIzracunatimPoljima => {
  // Fix the toJSON property issue by using type assertion for Sequelize Model
  const voziloJson = (typeof (voziloData as any).toJSON === 'function' 
    ? (voziloData as any).toJSON() 
    : voziloData) as VoziloOpremaAttributes;
  
  const izracunataPolja: Partial<VoziloOpremaSaIzracunatimPoljima> = {};

  // Filter
  izracunataPolja.datum_isteka_filtera_izracunat = izracunajDatumIstekaFiltera(voziloJson);
  izracunataPolja.dana_do_zamjene_filtera = daniDoDatuma(izracunataPolja.datum_isteka_filtera_izracunat || null);
  
  // Godišnja inspekcija (pretpostavka: rok je točno taj datum)
  izracunataPolja.dana_do_godisnje_inspekcije = daniDoDatuma(voziloJson.godisnja_inspekcija_datum || null);

  // Zamjena crijeva (svakih 10 godina)
  izracunataPolja.dana_do_zamjene_crijeva_hd_63 = izracunajDaneDoIsteka(voziloJson.zamjena_crijeva_hd_63_datum || null, 10, 'years');
  izracunataPolja.dana_do_zamjene_crijeva_hd_38 = izracunajDaneDoIsteka(voziloJson.zamjena_crijeva_hd_38_datum || null, 10, 'years');
  izracunataPolja.dana_do_zamjene_crijeva_tw_75 = izracunajDaneDoIsteka(voziloJson.zamjena_crijeva_tw_75_datum || null, 10, 'years');

  // Ispitivanje crijeva (svakih 6 mjeseci)
  izracunataPolja.dana_do_ispitivanja_crijeva_nepropusnost = izracunajDaneDoIsteka(voziloJson.ispitivanje_crijeva_nepropusnost_datum || null, 6, 'months');

  // Kalibracija senzora (svake 1 godine)
  izracunataPolja.dana_do_kalibracije_senzora = izracunajDaneDoIsteka(voziloJson.ugradjena_servisirana_senzor_datum || null, 1, 'years');

  // Kalibracija volumetra (svake 1 godine - pretpostavka)
  izracunataPolja.dana_do_kalibracije_volumetra = izracunajDaneDoIsteka(voziloJson.kalibraza_volumetra_datum || null, 1, 'years');

  // Umjeravanje manometara (svake 1 godine - pretpostavka)
  izracunataPolja.dana_do_umjeravanja_manometara = izracunajDaneDoIsteka(voziloJson.umjeravanje_manometara_datum || null, 1, 'years');

  // Ispitivanje HECPV/ILCPV (svakih 5 godina - pretpostavka)
  izracunataPolja.dana_do_ispitivanja_hecpv_ilcpv = izracunajDaneDoIsteka(voziloJson.ispitivanje_hecpv_ilcpv_datum || null, 5, 'years');

  return { ...voziloJson, ...izracunataPolja } as VoziloOpremaSaIzracunatimPoljima;
};


// --- CRUD Funkcije ---
export const getAllVozilaOprema = async (): Promise<VoziloOpremaSaIzracunatimPoljima[]> => {
  const vozila = await VoziloOprema.findAll({
    include: [ // Uključujemo povezane modele da bismo imali njihove nazive umjesto samo ID-eva
      { model: Firma, as: 'firma' },
      { model: Lokacija, as: 'lokacija' }
    ],
    order: [['naziv_vozila_usluge', 'ASC']] // Primjer sortiranja
  });
  return vozila.map(vozilo => dodajIzracunataPolja(vozilo));
};

export const getVoziloOpremaById = async (id: number): Promise<VoziloOpremaSaIzracunatimPoljima | null> => {
  const vozilo = await VoziloOprema.findByPk(id, {
    include: [
      { model: Firma, as: 'firma' },
      { model: Lokacija, as: 'lokacija' }
    ]
  });
  if (!vozilo) {
    throw new AppError('Vozilo/oprema nije pronađeno.', 404);
  }
  return dodajIzracunataPolja(vozilo);
};

export const createVoziloOprema = async (data: CreateVoziloOpremaDto): Promise<VoziloOpremaSaIzracunatimPoljima> => {
  try {
    // Provjera da li postoje Firma i Lokacija s danim ID-evima
    if (data.firma_id) {
      const firmaExists = await Firma.findByPk(data.firma_id);
      if (!firmaExists) throw new AppError(`Firma s ID-om ${data.firma_id} nije pronađena.`, 400);
    }
    if (data.lokacija_id) {
      const lokacijaExists = await Lokacija.findByPk(data.lokacija_id);
      if (!lokacijaExists) throw new AppError(`Lokacija s ID-om ${data.lokacija_id} nije pronađena.`, 400);
    }

    const novoVozilo = await VoziloOprema.create(data);
    // Dohvaćamo ponovo s include da bismo imali podatke za firmu i lokaciju za izračunata polja ako je potrebno
    // ili šaljemo na getVoziloOpremaById da obavi posao
    const dohvacenoNovoVozilo = await getVoziloOpremaById(novoVozilo.id);
    if (!dohvacenoNovoVozilo) { // Should not happen
        throw new AppError('Greška pri dohvaćanju novokreiranog vozila.', 500);
    }
    return dohvacenoNovoVozilo; // Već sadrži izračunata polja
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Pretpostavka: broj_tablica_vozila_opreme je unique
      throw new AppError('Vozilo/oprema s ovim brojem tablica već postoji.', 409);
    }
    if (error instanceof AppError) throw error; // Ponovno baci AppError ako je već naš
    console.error('Greška prilikom kreiranja vozila/opreme:', error);
    throw new AppError('Greška prilikom kreiranja vozila/opreme.', 500);
  }
};

export const updateVoziloOprema = async (id: number, data: UpdateVoziloOpremaDto): Promise<VoziloOpremaSaIzracunatimPoljima | null> => {
  const vozilo = await VoziloOprema.findByPk(id);
  if (!vozilo) {
    throw new AppError('Vozilo/oprema nije pronađeno za ažuriranje.', 404);
  }

  // Provjera da li postoje Firma i Lokacija ako se mijenjaju ID-evi
  if (data.firma_id && data.firma_id !== vozilo.firma_id) {
    const firmaExists = await Firma.findByPk(data.firma_id);
    if (!firmaExists) throw new AppError(`Firma s ID-om ${data.firma_id} nije pronađena.`, 400);
  }
  if (data.lokacija_id && data.lokacija_id !== vozilo.lokacija_id) {
    const lokacijaExists = await Lokacija.findByPk(data.lokacija_id);
    if (!lokacijaExists) throw new AppError(`Lokacija s ID-om ${data.lokacija_id} nije pronađena.`, 400);
  }

  try {
    await vozilo.update(data);
    // Dohvaćamo ponovo s include da bismo imali podatke za firmu i lokaciju za izračunata polja ako je potrebno
    // i da bismo primijenili izračunata polja na ažurirane podatke
    const azuriranoVozilo = await getVoziloOpremaById(id);
     if (!azuriranoVozilo) { // Should not happen
        throw new AppError('Greška pri dohvaćanju ažuriranog vozila.', 500);
    }
    return azuriranoVozilo;
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('Vozilo/oprema s ovim brojem tablica već postoji.', 409);
    }
    if (error instanceof AppError) throw error;
    console.error('Greška prilikom ažuriranja vozila/opreme:', error);
    throw new AppError('Greška prilikom ažuriranja vozila/opreme.', 500);
  }
};

export const deleteVoziloOprema = async (id: number): Promise<void> => {
  const vozilo = await VoziloOprema.findByPk(id);
  if (!vozilo) {
    throw new AppError('Vozilo/oprema nije pronađeno za brisanje.', 404);
  }
  // Dodatna logika, npr. provjera povezanih ServisnihNaloga prije brisanja
  // const povezaniNalozi = await ServisniNalog.count({ where: { vozilo_oprema_id: id } });
  // if (povezaniNalozi > 0) {
  //   throw new AppError('Nije moguće obrisati vozilo/opremu jer ima povezane servisne naloge.', 400);
  // }
  await vozilo.destroy();
}; 