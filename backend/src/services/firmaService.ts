import { Firma, FirmaAttributes } from '../models';
import { AppError } from '../utils/AppError';

// Tipovi za kreiranje i ažuriranje - mogu se kasnije premjestiti u src/types
interface CreateFirmaDto extends Omit<FirmaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
interface UpdateFirmaDto extends Partial<Omit<FirmaAttributes, 'id' | 'createdAt' | 'updatedAt'> > {}

export const getAllFirme = async (): Promise<FirmaAttributes[]> => {
  const firme = await Firma.findAll();
  return firme.map(f => f.toJSON() as FirmaAttributes);
};

export const getFirmaById = async (id: number): Promise<FirmaAttributes | null> => {
  const firma = await Firma.findByPk(id);
  if (!firma) {
    throw new AppError('Firma nije pronađena.', 404);
  }
  return firma.toJSON() as FirmaAttributes;
};

export const createFirma = async (data: CreateFirmaDto): Promise<FirmaAttributes> => {
  try {
    const novaFirma = await Firma.create(data);
    return novaFirma.toJSON() as FirmaAttributes;
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Pretpostavljamo da je 'naziv' unique constraint
      throw new AppError('Firma s ovim nazivom već postoji.', 409); // 409 Conflict
    }
    // Logirati originalnu grešku za debugging
    console.error('Greška prilikom kreiranja firme:', error);
    throw new AppError('Greška prilikom kreiranja firme.', 500);
  }
};

export const updateFirma = async (id: number, data: UpdateFirmaDto): Promise<FirmaAttributes | null> => {
  const firma = await Firma.findByPk(id);
  if (!firma) {
    throw new AppError('Firma nije pronađena za ažuriranje.', 404);
  }
  try {
    await firma.update(data);
    return firma.toJSON() as FirmaAttributes;
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('Firma s ovim nazivom već postoji.', 409);
    }
    console.error('Greška prilikom ažuriranja firme:', error);
    throw new AppError('Greška prilikom ažuriranja firme.', 500);
  }
};

export const deleteFirma = async (id: number): Promise<void> => {
  const firma = await Firma.findByPk(id);
  if (!firma) {
    throw new AppError('Firma nije pronađena za brisanje.', 404);
  }
  // Ovdje bi se mogla dodati provjera da li firma ima povezana vozila prije brisanja
  // npr. const povezanaVozila = await VoziloOprema.count({ where: { firma_id: id } });
  // if (povezanaVozila > 0) {
  //   throw new AppError('Nije moguće obrisati firmu jer ima povezana vozila.', 400);
  // }
  await firma.destroy();
}; 