import { Request, Response, NextFunction } from 'express';
import {
  getAllVozilaOprema,
  getVoziloOpremaById,
  createVoziloOprema,
  updateVoziloOprema,
  deleteVoziloOprema
} from '../services/voziloOpremaService';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/AppError';

export const getAllVozilaOpremaController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const vozila = await getAllVozilaOprema();
  res.status(200).json({
    status: 'success',
    results: vozila.length,
    data: {
      vozilaOprema: vozila,
    },
  });
});

export const getVoziloOpremaByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID vozila/opreme.', 400));
  }
  const vozilo = await getVoziloOpremaById(id);
  res.status(200).json({
    status: 'success',
    data: {
      voziloOprema: vozilo,
    },
  });
});

export const createVoziloOpremaController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { naziv_vozila_usluge, firma_id, broj_tablica_vozila_opreme, lokacija_id } = req.body;
  if (!naziv_vozila_usluge || !firma_id || !broj_tablica_vozila_opreme || !lokacija_id) {
    return next(new AppError('Obavezna polja nedostaju ili su neispravna.', 400));
  }

  const novoVozilo = await createVoziloOprema(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      voziloOprema: novoVozilo,
    },
  });
});

export const updateVoziloOpremaController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID vozila/opreme.', 400));
  }
  if (Object.keys(req.body).length === 0) {
    return next(new AppError('Nema podataka za ažuriranje.', 400));
  }

  const azuriranoVozilo = await updateVoziloOprema(id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      voziloOprema: azuriranoVozilo,
    },
  });
});

export const deleteVoziloOpremaController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID vozila/opreme.', 400));
  }
  await deleteVoziloOprema(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 