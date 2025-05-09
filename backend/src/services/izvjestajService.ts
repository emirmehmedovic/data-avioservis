import { Op } from 'sequelize';
import { ServisniNalog, VoziloOprema, Firma, Lokacija } from '../models';
import { AppError } from '../utils/AppError';

export interface IzvjestajOdrzavanjaOptions {
  voziloOpremaId: number;
  datumOd?: string;
  datumDo?: string;
}

/**
 * Generiše izvještaj o održavanju vozila/opreme sa servisnim nalozima
 */
export const generirajIzvjestajOdrzavanja = async (options: IzvjestajOdrzavanjaOptions) => {
  const { voziloOpremaId, datumOd, datumDo } = options;
  
  // Dohvati podatke o vozilu sa firmom i lokacijom
  const vozilo = await VoziloOprema.findByPk(voziloOpremaId, {
    include: [
      { model: Firma, as: 'firma' },
      { model: Lokacija, as: 'lokacija' }
    ]
  });
  
  if (!vozilo) {
    throw new AppError('Vozilo/oprema nije pronađena', 404);
  }

  // Kreiraj uvjete za filtriranje po datumu
  const whereConditions: any = {
    vozilo_oprema_id: voziloOpremaId,
  };
  
  if (datumOd || datumDo) {
    whereConditions.datum = {};
    
    if (datumOd) {
      whereConditions.datum[Op.gte] = datumOd;
    }
    
    if (datumDo) {
      whereConditions.datum[Op.lte] = datumDo;
    }
  }
  
  // Dohvati servisne naloge
  const servisniNalozi = await ServisniNalog.findAll({
    where: whereConditions,
    order: [['datum', 'DESC']]
  });
  
  // Formatiraj podatke za izvještaj
  const izvjestaj = {
    vozilo: {
      id: vozilo.id,
      naziv: vozilo.naziv_vozila_usluge,
      brojTablica: vozilo.broj_tablica_vozila_opreme,
      firma: vozilo.get('firma') ? (vozilo.get('firma') as any).naziv : null,
      lokacija: vozilo.get('lokacija') ? (vozilo.get('lokacija') as any).naziv : null,
      status: vozilo.status,
      godisnjaInspekcija: vozilo.godisnja_inspekcija_datum,
      datumUgradnjeFiltera: vozilo.datum_ugradnje_filtera,
      datumIstekaFiltera: vozilo.get('datum_isteka_filtera_izracunat') || vozilo.datum_isteka_filtera_rucno,
      periodVazenjaFiltera: vozilo.period_vazenja_filtera_mjeseci,
    },
    servisniNalozi: servisniNalozi.map(nalog => ({
      id: nalog.id,
      datum: nalog.datum,
      opisServisa: nalog.opis_servisa,
      kilometraza: nalog.get('kilometraza') || null,
      racunBroj: nalog.get('racun_broj') || null,
      iznos: nalog.get('iznos') || null,
      promjenaUlja: nalog.get('promjena_ulja') || false,
      promjenaFiltera: nalog.get('promjena_filtera') || false,
      napomena: nalog.napomena,
      createdAt: nalog.createdAt,
    })),
    ukupnaStatistika: {
      brojServisa: servisniNalozi.length,
      ukupnoTroskovi: servisniNalozi.reduce((sum, nalog) => {
        const iznos = nalog.get('iznos') as number | null;
        return sum + (iznos || 0);
      }, 0),
      datumPrvogServisa: servisniNalozi.length > 0 ? 
        servisniNalozi[servisniNalozi.length - 1].datum : null,
      datumZadnjegServisa: servisniNalozi.length > 0 ? 
        servisniNalozi[0].datum : null,
    },
    metapodaci: {
      datumGenerisanja: new Date().toISOString(),
      parametriIzvjestaja: {
        datumOd: datumOd || null,
        datumDo: datumDo || null
      }
    }
  };
  
  return izvjestaj;
};

/**
 * Generiše PDF izvještaj o održavanju vozila/opreme
 */
export const generirajPdfIzvjestaj = async (options: IzvjestajOdrzavanjaOptions) => {
  // Prvo generiši standardni izvještaj 
  const izvjestaj = await generirajIzvjestajOdrzavanja(options);
  
  // Vraćamo podatke za PDF (u stvarnoj implementaciji ovdje bi bio kod za generisanje PDF-a)
  // Za sada samo simuliramo da vraćamo podatke koji bi se koristili za PDF
  return {
    ...izvjestaj,
    format: 'pdf'
  };
};

/**
 * Generiše Excel izvještaj o održavanju vozila/opreme
 */
export const generirajExcelIzvjestaj = async (options: IzvjestajOdrzavanjaOptions) => {
  // Prvo generiši standardni izvještaj
  const izvjestaj = await generirajIzvjestajOdrzavanja(options);
  
  // Vraćamo podatke za Excel (u stvarnoj implementaciji ovdje bi bio kod za generisanje Excel-a)
  // Za sada samo simuliramo da vraćamo podatke koji bi se koristili za Excel
  return {
    ...izvjestaj,
    format: 'excel'
  };
}; 