import { Request, Response, NextFunction } from 'express';
import * as servisniNalogService from '../services/servisniNalogService';
import { catchAsync, AppError } from '../utils/AppError';

export const createServisniNalog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Ovdje ide detaljna validacija (npr. Zod)
  // Provjeriti obavezna polja (datum, opis_servisa), format datuma,
  // i da je poslan ILI vozilo_oprema_id ILI broj_tablica_vozila_opreme
  const { datum, opis_servisa, vozilo_oprema_id, broj_tablica_vozila_opreme } = req.body;
  if (!datum || !opis_servisa || (!vozilo_oprema_id && !broj_tablica_vozila_opreme)) {
    return next(new AppError('Datum, opis servisa i identifikator vozila (ID ili tablica) su obavezni.', 400));
  }
  if (vozilo_oprema_id && broj_tablica_vozila_opreme) {
     return next(new AppError('Pošaljite ili ID vozila ili broj tablica, ne oboje.', 400));
  }
  // Dodati validaciju formata datuma...

  const noviNalog = await servisniNalogService.createServisniNalog(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      servisniNalog: noviNalog,
    },
  });
});

export const getAllServisniNalozi = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Omogućavamo filtriranje po ID-u vozila iz query parametra
  const options: servisniNalogService.GetAllServisniNaloziOptions = {};
  if (req.query.voziloOpremaId && typeof req.query.voziloOpremaId === 'string') {
    const voziloId = parseInt(req.query.voziloOpremaId, 10);
    if (!isNaN(voziloId)) {
      options.voziloOpremaId = voziloId;
    }
  }

  const nalozi = await servisniNalogService.getAllServisniNalozi(options);
  res.status(200).json({
    status: 'success',
    results: nalozi.length,
    data: {
      servisniNalozi: nalozi,
    },
  });
});

export const getServisniNalogById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID servisnog naloga.', 400));
  }
  const nalog = await servisniNalogService.getServisniNalogById(id);
  res.status(200).json({
    status: 'success',
    data: {
      servisniNalog: nalog,
    },
  });
});

export const updateServisniNalog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID servisnog naloga.', 400));
  }
  if (Object.keys(req.body).length === 0) {
    return next(new AppError('Nema podataka za ažuriranje.', 400));
  }
  if (req.body.vozilo_oprema_id || req.body.broj_tablica_vozila_opreme) {
    return next(new AppError('Promjena povezanog vozila nije dozvoljena.', 400));
  }

  const azuriraniNalog = await servisniNalogService.updateServisniNalog(id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      servisniNalog: azuriraniNalog,
    },
  });
});

export const deleteServisniNalog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID servisnog naloga.', 400));
  }
  await servisniNalogService.deleteServisniNalog(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 