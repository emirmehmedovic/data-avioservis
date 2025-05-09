import { Request, Response, NextFunction } from 'express';
import * as firmaService from '../services/firmaService';
import { catchAsync, AppError } from '../utils/AppError';

export const getAllFirme = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const firme = await firmaService.getAllFirme();
  res.status(200).json({
    status: 'success',
    results: firme.length,
    data: {
      firme,
    },
  });
});

export const getFirmaById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID firme.', 400));
  }
  const firma = await firmaService.getFirmaById(id);
  // getFirmaById već baca AppError ako nije nađena, tako da nema potrebe za dodatnom provjerom ovdje
  res.status(200).json({
    status: 'success',
    data: {
      firma,
    },
  });
});

export const createFirma = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Ovdje će ići validacija podataka iz req.body (npr. express-validator ili zod)
  // Primjer osnovne provjere:
  const { naziv } = req.body;
  if (!naziv || typeof naziv !== 'string' || naziv.trim() === '') {
    return next(new AppError('Naziv firme je obavezan i mora biti string.', 400));
  }

  const novaFirma = await firmaService.createFirma(req.body); // Proslijeđujemo cijeli body, servis će uzeti što mu treba
  res.status(201).json({
    status: 'success',
    data: {
      firma: novaFirma,
    },
  });
});

export const updateFirma = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID firme.', 400));
  }
  // Validacija za req.body
  const { naziv } = req.body;
  if (naziv !== undefined && (typeof naziv !== 'string' || naziv.trim() === '')) {
    return next(new AppError('Ako je naziv proslijeđen, mora biti validan string.', 400));
  }
  
  const azuriranaFirma = await firmaService.updateFirma(id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      firma: azuriranaFirma,
    },
  });
});

export const deleteFirma = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID firme.', 400));
  }
  await firmaService.deleteFirma(id);
  res.status(204).json({
    status: 'success',
    data: null, // Nema sadržaja za odgovor kod brisanja
  });
}); 