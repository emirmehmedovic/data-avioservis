import express from 'express';
import * as izvjestajController from '../controllers/izvjestajController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Zaštititi sve rute za izvještaje s autentikacijom
router.use(protect);

// Rute za izvještaje o održavanju vozila/opreme
router.get('/vozilo/:voziloOpremaId/odrzavanje', izvjestajController.generirajIzvjestajOdrzavanja);
router.get('/vozilo/:voziloOpremaId/odrzavanje/pdf', izvjestajController.generirajPdfIzvjestaj);
router.get('/vozilo/:voziloOpremaId/odrzavanje/excel', izvjestajController.generirajExcelIzvjestaj);

export default router; 