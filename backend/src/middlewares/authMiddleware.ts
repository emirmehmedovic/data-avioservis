import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError, catchAsync } from '../utils/AppError';
import { Korisnik, KorisnikAttributes, UserRole } from '../models'; // Import Korisnik modela i UserRole

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Trebalo bi biti isto kao u authService

// Proširujemo Express Request interface da uključuje 'user' property
// Ovo je bolji način nego `Request & { user?: KorisnikAttributes }` direktno u handlerima
declare global {
  namespace Express {
    interface Request {
      user?: KorisnikAttributes;
    }
  }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  // 1) Uzimanje tokena i provjera da li postoji
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Može se dodati i provjera tokena iz cookie-ja ako se odlučite za taj pristup

  if (!token) {
    return next(new AppError('Niste prijavljeni! Molimo prijavite se da biste dobili pristup.', 401));
  }

  // 2) Verifikacija tokena
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verification successful:', decoded);
  } catch (err) {
    console.error('Token verification failed:', err);
    return next(new AppError('Neispravan token. Molimo prijavite se ponovo.', 401));
  }

  // 3) Provjera da li korisnik još uvijek postoji
  const currentUser = await Korisnik.findByPk(decoded.id);
  if (!currentUser) {
    return next(new AppError('Korisnik koji pripada ovom tokenu više ne postoji.', 401));
  }

  // Ovdje se može dodati provjera da li je korisnik promijenio lozinku nakon što je token izdan
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('Korisnik je nedavno promijenio lozinku! Molimo prijavite se ponovo.', 401));
  // }

  // PRISTUP ODOBREN: Postavljanje korisnika na request objekt
  req.user = currentUser.toJSON() as KorisnikAttributes; // Koristimo toJSON da bismo dobili čiste atribute bez Sequelize dodataka
  next();
});

// Middleware za provjeru uloga
// Prima listu dozvoljenih uloga
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // roles je niz ['Admin', 'Serviser']. req.user.role je iz baze.
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return next(new AppError('Nemate dozvolu za izvršavanje ove akcije.', 403)); // 403 Forbidden
    }
    next();
  };
}; 