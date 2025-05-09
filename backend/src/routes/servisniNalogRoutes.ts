import { Router } from 'express';
import * as servisniNalogController from '../controllers/servisniNalogController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { UserRole } from '../models';

const router = Router();

router.use(protect);

// Ruta za dohvaćanje svih naloga (svi prijavljeni) ili filtriranje po vozilu
// GET /api/servisni-nalozi?voziloOpremaId=123
router.route('/')
  .get(servisniNalogController.getAllServisniNalozi)
  .post(restrictTo(UserRole.ADMIN, UserRole.SERVISER), servisniNalogController.createServisniNalog);

router.route('/:id')
  .get(servisniNalogController.getServisniNalogById)
  .patch(restrictTo(UserRole.ADMIN, UserRole.SERVISER), servisniNalogController.updateServisniNalog)
  .delete(restrictTo(UserRole.ADMIN, UserRole.SERVISER), servisniNalogController.deleteServisniNalog); // Ili samo ADMIN?

export default router; 