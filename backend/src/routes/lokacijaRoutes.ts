import { Router } from 'express';
import * as lokacijaController from '../controllers/lokacijaController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { UserRole } from '../models';

const router = Router();

router.use(protect);

router.route('/')
  .get(lokacijaController.getAllLokacije)
  .post(restrictTo(UserRole.ADMIN, UserRole.SERVISER), lokacijaController.createLokacija);

router.route('/:id')
  .get(lokacijaController.getLokacijaById)
  .patch(restrictTo(UserRole.ADMIN, UserRole.SERVISER), lokacijaController.updateLokacija)
  .delete(restrictTo(UserRole.ADMIN), lokacijaController.deleteLokacija);

export default router; 