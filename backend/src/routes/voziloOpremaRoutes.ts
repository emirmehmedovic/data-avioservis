import { Router } from 'express';
import {
  getAllVozilaOpremaController,
  createVoziloOpremaController,
  getVoziloOpremaByIdController,
  updateVoziloOpremaController,
  deleteVoziloOpremaController
} from '../controllers/voziloOpremaController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { UserRole } from '../models';

const router = Router();

// Sve rute ispod su zaštićene
router.use(protect);

router.route('/')
  .get(getAllVozilaOpremaController) // Svi prijavljeni mogu vidjeti
  .post(restrictTo(UserRole.ADMIN, UserRole.SERVISER), createVoziloOpremaController); // Admin i Serviser mogu kreirati

router.route('/:id')
  .get(getVoziloOpremaByIdController) // Svi prijavljeni mogu vidjeti
  .patch(restrictTo(UserRole.ADMIN, UserRole.SERVISER), updateVoziloOpremaController) // Admin i Serviser mogu ažurirati
  .delete(restrictTo(UserRole.ADMIN), deleteVoziloOpremaController); // Samo Admin može brisati

export default router; 