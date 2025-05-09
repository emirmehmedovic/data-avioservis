import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { UserRole } from '../models';

const router = Router();

// Sve rute za upravljanje korisnicima zahtijevaju da korisnik bude prijavljen i da bude Admin
router.use(protect);
router.use(restrictTo(UserRole.ADMIN));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUserByAdmin);

router.route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUserByAdmin)
  .delete(userController.deleteUserByAdmin);

export default router; 