import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Korisnik, KorisnikAttributes, UserRole } from '../models'; // Pretpostavljamo da je Korisnik eksportiran iz models/index.ts
import { AppError } from '../utils/AppError'; // Kreirat ćemo ovu pomoćnu klasu kasnije

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Trebalo bi doći iz .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  role?: UserRole; // Opcionalno, jer admin ne mora specificirati
}

interface UserLoginData {
  email: string;
  password: string;
}

export const registerUser = async (userData: UserRegistrationData): Promise<Omit<KorisnikAttributes, 'password_hash'>> => {
  const { email, username, password } = userData;
  const roleToSet = userData.role || UserRole.PREGLEDNIK; // Postavljamo default EKSPLICITNO

  const existingUserByEmail = await Korisnik.findOne({ where: { email } });
  if (existingUserByEmail) {
    throw new AppError('Korisnik s ovim emailom već postoji.', 409);
  }

  const existingUserByUsername = await Korisnik.findOne({ where: { username } });
  if (existingUserByUsername) {
    throw new AppError('Korisnik s ovim korisničkim imenom već postoji.', 409);
  }

  const newUser = await Korisnik.create({
    email,
    username,
    password, // Hook će hashirati
    role: roleToSet, // Sada je ovo garantirano UserRole, a ne undefined
  });

  return newUser.toJSON() as Omit<KorisnikAttributes, 'password_hash'>;
};

export const loginUser = async (loginData: UserLoginData): Promise<Omit<KorisnikAttributes, 'password_hash'> & { token: string }> => {
  const { email, password } = loginData;

  const userWithPassword = await Korisnik.findOne({ 
    where: { email }, 
    attributes: { include: ['password_hash'] },
    raw: true, 
  });

  if (!userWithPassword || !userWithPassword.password_hash) { 
      throw new AppError('Neispravan email ili lozinka.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, userWithPassword.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Neispravan email ili lozinka.', 401);
  }

  const { password_hash, ...userResponseData } = userWithPassword;
  
  // Create payload and explicitly type the secret
  const payload = { id: userResponseData.id, role: userResponseData.role };
  
  // Use Buffer for the JWT_SECRET to fix type issues
  const token = jwt.sign(
    payload,
    Buffer.from(JWT_SECRET),
    { expiresIn: '1d' } // Hardcode a known valid value
  );

  return { ...userResponseData, token };
}; 