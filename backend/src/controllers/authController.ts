import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { catchAsync } from '../utils/AppError';
// UserRole i KorisnikAttributes se više ne koriste ovdje direktno, ali mogu ostati za svaki slučaj
import { KorisnikAttributes, UserRole } from '../models';

interface LoginRequestBody {
  email: string;
  password: string;
}

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as LoginRequestBody;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email i lozinka su obavezni.' });
  }

  const userData = await authService.loginUser({ email, password });

  // Vraćamo token i user podatke u formatu koji frontend očekuje
  res.status(200).json({
    token: userData.token,
    user: {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    }
  });
});

// Primjer zaštićene rute - samo za testiranje middlewarea kasnije
// export const getMe = catchAsync(async (req: Request & { user?: KorisnikAttributes }, res: Response, next: NextFunction) => {
//   // req.user bi trebao biti postavljen od strane authMiddleware
//   if (!req.user) {
//     return res.status(401).json({ message: 'Niste prijavljeni.'});
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: req.user,
//     },
//   });
// }); 