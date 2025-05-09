import { ServisniNalog, ServisniNalogAttributes, VoziloOprema, Firma, Lokacija } from '../models';
import { AppError } from '../utils/AppError';
import { Op } from 'sequelize';

// DTOs
// Prilikom kreiranja, možemo primiti ili vozilo_oprema_id ili broj_tablica_vozila_opreme
interface BaseCreateServisniNalogDto extends Omit<ServisniNalogAttributes, 'id' | 'createdAt' | 'updatedAt' | 'vozilo_oprema_id'> {
  // Opis servisa i datum su obavezni
}
interface CreateServisniNalogByIdDto extends BaseCreateServisniNalogDto {
  vozilo_oprema_id: number;
  broj_tablica_vozila_opreme?: never; // Osiguravamo da se ne šalje oboje
}
interface CreateServisniNalogByTablicaDto extends BaseCreateServisniNalogDto {
  broj_tablica_vozila_opreme: string;
  vozilo_oprema_id?: never; // Osiguravamo da se ne šalje oboje
}
export type CreateServisniNalogDto = CreateServisniNalogByIdDto | CreateServisniNalogByTablicaDto;

// Za update, ID naloga je u URL-u, možemo mijenjati sve osim ID-a i vozilo_oprema_id
export interface UpdateServisniNalogDto extends Partial<Omit<ServisniNalogAttributes, 'id' | 'createdAt' | 'updatedAt' | 'vozilo_oprema_id'>> {}

// Opcije za dohvaćanje (filtriranje)
export interface GetAllServisniNaloziOptions {
  voziloOpremaId?: number;
}

export const createServisniNalog = async (data: CreateServisniNalogDto): Promise<ServisniNalogAttributes> => {
  let voziloId: number;

  // 1. Pronađi ID vozila na osnovu poslanih podataka
  if (data.vozilo_oprema_id) {
    const voziloExists = await VoziloOprema.findByPk(data.vozilo_oprema_id);
    if (!voziloExists) {
      throw new AppError(`Vozilo/oprema s ID-om ${data.vozilo_oprema_id} nije pronađeno.`, 400);
    }
    voziloId = data.vozilo_oprema_id;
  } else if (data.broj_tablica_vozila_opreme) {
    const vozilo = await VoziloOprema.findOne({ where: { broj_tablica_vozila_opreme: data.broj_tablica_vozila_opreme } });
    if (!vozilo) {
      throw new AppError(`Vozilo/oprema s brojem tablica '${data.broj_tablica_vozila_opreme}' nije pronađeno.`, 400);
    }
    voziloId = vozilo.id;
  } else {
    throw new AppError('Potrebno je navesti ili vozilo_oprema_id ili broj_tablica_vozila_opreme.', 400);
  }

  // 2. Kreiraj servisni nalog s pronađenim voziloId
  try {
    const { broj_tablica_vozila_opreme, ...ostaliPodaci } = data; // Uklanjamo broj_tablica ako je poslan
    const noviNalog = await ServisniNalog.create({
      ...ostaliPodaci,
      vozilo_oprema_id: voziloId,
    });
    return noviNalog.toJSON() as ServisniNalogAttributes;
  } catch (error: any) {
    console.error('Greška prilikom kreiranja servisnog naloga:', error);
    throw new AppError('Greška prilikom kreiranja servisnog naloga.', 500);
  }
};

export const getAllServisniNalozi = async (options: GetAllServisniNaloziOptions = {}): Promise<ServisniNalogAttributes[]> => {
  const whereClause: any = {};
  if (options.voziloOpremaId) {
    whereClause.vozilo_oprema_id = options.voziloOpremaId;
  }

  const nalozi = await ServisniNalog.findAll({
    where: whereClause,
    include: [
      { 
        model: VoziloOprema, 
        as: 'voziloOprema',
        include: [
           { model: Firma, as: 'firma' }, 
           { model: Lokacija, as: 'lokacija' } 
        ] 
      }
    ],
    order: [['datum', 'DESC']]
  });
  return nalozi.map(n => n.toJSON() as ServisniNalogAttributes);
};

export const getServisniNalogById = async (id: number): Promise<ServisniNalogAttributes | null> => {
  const nalog = await ServisniNalog.findByPk(id, {
     include: [
      { 
        model: VoziloOprema, 
        as: 'voziloOprema',
        include: [ 
           { model: Firma, as: 'firma' }, 
           { model: Lokacija, as: 'lokacija' } 
        ] 
      }
    ]
  });
  if (!nalog) {
    throw new AppError('Servisni nalog nije pronađen.', 404);
  }
  return nalog.toJSON() as ServisniNalogAttributes;
};

export const updateServisniNalog = async (id: number, data: UpdateServisniNalogDto): Promise<ServisniNalogAttributes | null> => {
  const nalog = await ServisniNalog.findByPk(id);
  if (!nalog) {
    throw new AppError('Servisni nalog nije pronađen za ažuriranje.', 404);
  }
  try {
    await nalog.update(data);
    const azuriraniNalog = await getServisniNalogById(id);
     if (!azuriraniNalog) { 
        throw new AppError('Greška pri dohvaćanju ažuriranog naloga.', 500);
    }
    return azuriraniNalog;
  } catch (error: any) {
    console.error('Greška prilikom ažuriranja servisnog naloga:', error);
    throw new AppError('Greška prilikom ažuriranja servisnog naloga.', 500);
  }
};

export const deleteServisniNalog = async (id: number): Promise<void> => {
  const nalog = await ServisniNalog.findByPk(id);
  if (!nalog) {
    throw new AppError('Servisni nalog nije pronađen za brisanje.', 404);
  }
  await nalog.destroy();
}; 