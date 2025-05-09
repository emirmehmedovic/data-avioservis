import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { catchAsync, AppError } from '../utils/AppError';
import { UserRole } from '../models';

// DTO za kreiranje korisnika od strane admina
interface CreateUserByAdminBody {
  username: string;
  email: string;
  password: string;
  role: UserRole; // Admin mora specificirati ulogu
}

export const createUserByAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, role } = req.body as CreateUserByAdminBody;

  // Osnovna validacija (kasnije zamijeniti s npr. Zod)
  if (!username || !email || !password || !role) {
    return next(new AppError('Korisničko ime, email, lozinka i uloga su obavezni.', 400));
  }
  if (!Object.values(UserRole).includes(role)) {
    return next(new AppError('Nevažeća uloga korisnika.', 400));
  }

  const newUser = await userService.createUserByAdmin({ username, email, password, role });
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID korisnika.', 400));
  }
  const user = await userService.getUserById(id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// DTO za ažuriranje korisnika od strane admina
interface UpdateUserByAdminBody {
  username?: string;
  email?: string;
  role?: UserRole;
  // Lozinka se ne mijenja ovdje
}

export const updateUserByAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID korisnika.', 400));
  }

  const updateData = req.body as UpdateUserByAdminBody;

  if (Object.keys(updateData).length === 0) {
    return next(new AppError('Nema podataka za ažuriranje.', 400));
  }
  if (updateData.role && !Object.values(UserRole).includes(updateData.role)) {
    return next(new AppError('Nevažeća uloga korisnika.', 400));
  }
  // Dodatne validacije za email format, username, itd. bi išle ovdje

  const updatedUser = await userService.updateUserByAdmin(id, updateData);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteUserByAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return next(new AppError('Neispravan ID korisnika.', 400));
  }

  // Ovdje bi se mogla dodati provjera da admin ne briše sam sebe
  // if (req.user && req.user.id === id) {
  //   return next(new AppError('Ne možete obrisati sami sebe.', 400));
  // }

  await userService.deleteUserByAdmin(id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
}); 