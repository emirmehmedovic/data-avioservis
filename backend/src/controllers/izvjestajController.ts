import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/AppError';
import * as izvjestajService from '../services/izvjestajService';

/**
 * Generiši izvještaj o održavanju u JSON formatu
 */
export const generirajIzvjestajOdrzavanja = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const voziloOpremaId = Number(req.params.voziloOpremaId);
  
  if (isNaN(voziloOpremaId)) {
    return res.status(400).json({ message: 'Neispravan ID vozila/opreme' });
  }
  
  const { datumOd, datumDo } = req.query;
  
  const izvjestaj = await izvjestajService.generirajIzvjestajOdrzavanja({
    voziloOpremaId,
    datumOd: datumOd as string | undefined,
    datumDo: datumDo as string | undefined
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      izvjestaj
    }
  });
});

/**
 * Generiši PDF izvještaj o održavanju
 */
export const generirajPdfIzvjestaj = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const voziloOpremaId = Number(req.params.voziloOpremaId);
  
  if (isNaN(voziloOpremaId)) {
    return res.status(400).json({ message: 'Neispravan ID vozila/opreme' });
  }
  
  const { datumOd, datumDo } = req.query;
  
  const izvjestaj = await izvjestajService.generirajPdfIzvjestaj({
    voziloOpremaId,
    datumOd: datumOd as string | undefined,
    datumDo: datumDo as string | undefined
  });
  
  // Obično bismo ovdje generirali stvarni PDF i postavili headere za preuzimanje
  // Za sada samo vraćamo JSON s posebnim formatom koji bi služio za generisanje PDF-a
  
  res.status(200).json({
    status: 'success',
    data: {
      izvjestaj
    }
  });
});

/**
 * Generiši Excel izvještaj o održavanju
 */
export const generirajExcelIzvjestaj = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const voziloOpremaId = Number(req.params.voziloOpremaId);
  
  if (isNaN(voziloOpremaId)) {
    return res.status(400).json({ message: 'Neispravan ID vozila/opreme' });
  }
  
  const { datumOd, datumDo } = req.query;
  
  const izvjestaj = await izvjestajService.generirajExcelIzvjestaj({
    voziloOpremaId,
    datumOd: datumOd as string | undefined,
    datumDo: datumDo as string | undefined
  });
  
  // Obično bismo ovdje generirali stvarni Excel i postavili headere za preuzimanje
  // Za sada samo vraćamo JSON s posebnim formatom koji bi služio za generisanje Excel-a
  
  res.status(200).json({
    status: 'success',
    data: {
      izvjestaj
    }
  });
}); 