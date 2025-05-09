import { Router } from 'express';
import * as firmaController from '../controllers/firmaController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { UserRole } from '../models'; // Za korištenje u restrictTo

const router = Router();

// Sve rute ispod ove linije će biti zaštićene (zahtijevaju prijavu)
router.use(protect);

router.route('/')
  .get(firmaController.getAllFirme) // Svi prijavljeni korisnici mogu vidjeti firme
  .post(restrictTo(UserRole.ADMIN, UserRole.SERVISER), firmaController.createFirma); // Samo Admin i Serviser mogu kreirati

router.route('/:id')
  .get(firmaController.getFirmaById) // Svi prijavljeni korisnici mogu vidjeti pojedinačnu firmu
  .patch(restrictTo(UserRole.ADMIN, UserRole.SERVISER), firmaController.updateFirma) // Samo Admin i Serviser mogu ažurirati
  .delete(restrictTo(UserRole.ADMIN), firmaController.deleteFirma); // Samo Admin može brisati

export default router; 