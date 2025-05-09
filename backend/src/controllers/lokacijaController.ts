import { Request, Response, NextFunction } from 'express';
import * as lokacijaService from '../services/lokacijaService';
import { catchAsync, AppError } from '../utils/AppError';

export const getAllLokacije = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lokacije = await lokacijaService.getAllLokacije();
  res.status(200).json({
    status: 'success',
    results: lokacije.length,
    data: {
      lokacije,
    },
  });
});

export const getLokacijaById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID lokacije.', 400));
  }
  const lokacija = await lokacijaService.getLokacijaById(id);
  res.status(200).json({
    status: 'success',
    data: {
      lokacija,
    },
  });
});

export const createLokacija = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { naziv } = req.body;
  if (!naziv || typeof naziv !== 'string' || naziv.trim() === '') {
    return next(new AppError('Naziv lokacije je obavezan i mora biti string.', 400));
  }
  // Adresa je opcionalna, pa nećemo ovdje raditi strogu provjeru za nju bez detaljnije validacije

  const novaLokacija = await lokacijaService.createLokacija(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      lokacija: novaLokacija,
    },
  });
});

export const updateLokacija = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID lokacije.', 400));
  }
  const { naziv } = req.body;
  if (naziv !== undefined && (typeof naziv !== 'string' || naziv.trim() === '')) {
    return next(new AppError('Ako je naziv lokacije proslijeđen, mora biti validan string.', 400));
  }

  const azuriranaLokacija = await lokacijaService.updateLokacija(id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      lokacija: azuriranaLokacija,
    },
  });
});

export const deleteLokacija = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID lokacije.', 400));
  }
  await lokacijaService.deleteLokacija(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 