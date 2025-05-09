import { Router } from 'express';
import * as authController from '../controllers/authController';
// Kasnije ćemo dodati middleware za validaciju
// import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware'; // Primjer

const router = Router();

// POST /api/auth/login
router.post(
    '/login',
    // validateLogin, // Dodati kasnije
    authController.login
);

// Primjer zaštićene rute (ako je definirana getMe u authControlleru)
// import { protect } from '../middlewares/authMiddleware'; // Kreirat ćemo kasnije
// router.get('/me', protect, authController.getMe);

export default router; 