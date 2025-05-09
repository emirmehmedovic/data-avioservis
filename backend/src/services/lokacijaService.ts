import { Lokacija, LokacijaAttributes } from '../models';
import { AppError } from '../utils/AppError';

// Tipovi za kreiranje i ažuriranje
interface CreateLokacijaDto extends Omit<LokacijaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
interface UpdateLokacijaDto extends Partial<Omit<LokacijaAttributes, 'id' | 'createdAt' | 'updatedAt'> > {}

export const getAllLokacije = async (): Promise<LokacijaAttributes[]> => {
  const lokacije = await Lokacija.findAll();
  return lokacije.map(l => l.toJSON() as LokacijaAttributes);
};

export const getLokacijaById = async (id: number): Promise<LokacijaAttributes | null> => {
  const lokacija = await Lokacija.findByPk(id);
  if (!lokacija) {
    throw new AppError('Lokacija nije pronađena.', 404);
  }
  return lokacija.toJSON() as LokacijaAttributes;
};

export const createLokacija = async (data: CreateLokacijaDto): Promise<LokacijaAttributes> => {
  try {
    const novaLokacija = await Lokacija.create(data);
    return novaLokacija.toJSON() as LokacijaAttributes;
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Pretpostavljamo da je 'naziv' unique constraint
      throw new AppError('Lokacija s ovim nazivom već postoji.', 409);
    }
    console.error('Greška prilikom kreiranja lokacije:', error);
    throw new AppError('Greška prilikom kreiranja lokacije.', 500);
  }
};

export const updateLokacija = async (id: number, data: UpdateLokacijaDto): Promise<LokacijaAttributes | null> => {
  const lokacija = await Lokacija.findByPk(id);
  if (!lokacija) {
    throw new AppError('Lokacija nije pronađena za ažuriranje.', 404);
  }
  try {
    await lokacija.update(data);
    return lokacija.toJSON() as LokacijaAttributes;
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('Lokacija s ovim nazivom već postoji.', 409);
    }
    console.error('Greška prilikom ažuriranja lokacije:', error);
    throw new AppError('Greška prilikom ažuriranja lokacije.', 500);
  }
};

export const deleteLokacija = async (id: number): Promise<void> => {
  const lokacija = await Lokacija.findByPk(id);
  if (!lokacija) {
    throw new AppError('Lokacija nije pronađena za brisanje.', 404);
  }
  // Ovdje bi se mogla dodati provjera da li lokacija ima povezana vozila prije brisanja
  // const povezanaVozila = await VoziloOprema.count({ where: { lokacija_id: id } });
  // if (povezanaVozila > 0) {
  //   throw new AppError('Nije moguće obrisati lokaciju jer ima povezana vozila.', 400);
  // }
  await lokacija.destroy();
}; 