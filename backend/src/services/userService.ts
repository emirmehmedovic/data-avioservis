import { Korisnik, KorisnikAttributes, UserRole } from '../models';
import { AppError } from '../utils/AppError';

// Tipovi za DTOs - mogu se kasnije premjestiti u src/types
// Slično kao UserRegistrationData iz authService, ali ovo je za admina
interface CreateUserByAdminDto {
  username: string;
  email: string;
  password: string;
  role: UserRole; // Admin mora specificirati ulogu
}

interface UpdateUserByAdminDto extends Partial<Omit<KorisnikAttributes, 'id' | 'createdAt' | 'updatedAt' | 'password_hash' | 'password'>> {
  // Admin može mijenjati username, email, role.
  // Lozinku bi trebalo mijenjati kroz poseban endpoint/logiku ako je potrebno.
}

export const createUserByAdmin = async (data: CreateUserByAdminDto): Promise<Omit<KorisnikAttributes, 'password_hash'>> => {
  const { email, username, password, role } = data;

  const existingUserByEmail = await Korisnik.findOne({ where: { email } });
  if (existingUserByEmail) {
    throw new AppError('Korisnik s ovim emailom već postoji.', 409);
  }

  const existingUserByUsername = await Korisnik.findOne({ where: { username } });
  if (existingUserByUsername) {
    throw new AppError('Korisnik s ovim korisničkim imenom već postoji.', 409);
  }

  // Password će biti hashiran pomoću Sequelize hook-a u Korisnik modelu
  const newUser = await Korisnik.create({
    email,
    username,
    password, // Proslijeđujemo plain password, hook će ga hashirati
    role,
  });

  return newUser.toJSON() as Omit<KorisnikAttributes, 'password_hash'>;
};

export const getAllUsers = async (): Promise<Omit<KorisnikAttributes, 'password_hash'>[]> => {
  const users = await Korisnik.findAll();
  // Koristimo toJSON() koji je definiran u Korisnik modelu da bismo izbacili password_hash
  // Svaki user.toJSON() vraća Omit<KorisnikAttributes, 'password_hash'>, a map() ih skuplja u niz.
  return users.map(user => user.toJSON() as Omit<KorisnikAttributes, 'password_hash'>);
};

export const getUserById = async (id: number): Promise<Omit<KorisnikAttributes, 'password_hash'> | null> => {
  const user = await Korisnik.findByPk(id);
  if (!user) {
    throw new AppError('Korisnik nije pronađen.', 404);
  }
  return user.toJSON() as Omit<KorisnikAttributes, 'password_hash'>;
};

export const updateUserByAdmin = async (id: number, data: UpdateUserByAdminDto): Promise<Omit<KorisnikAttributes, 'password_hash'>> => {
  const user = await Korisnik.findByPk(id);
  if (!user) {
    throw new AppError('Korisnik nije pronađen za ažuriranje.', 404);
  }

  // Ne dozvoljavamo promjenu lozinke kroz ovaj DTO/servis
  // Ako je 'password' u data, ignoriraj ga ili baci grešku
  if ('password' in data || 'password_hash' in data) {
    throw new AppError('Promjena lozinke nije dozvoljena putem ovog servisa.', 400);
  }

  try {
    await user.update(data);
    return user.toJSON() as Omit<KorisnikAttributes, 'password_hash'>;
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Provjeriti na koje polje se odnosi unique constraint (email ili username)
      // Možda je potrebno specifičnije rukovanje greškom
      let field = 'email ili korisničko ime';
      if (error.fields && typeof error.fields === 'object' && !Array.isArray(error.fields)) {
        const fieldKeys = Object.keys(error.fields);
        if (fieldKeys.length > 0) field = fieldKeys.join(', ');
      }
      throw new AppError(`Korisnik s ovim ${field} već postoji.`, 409);
    }
    console.error('Greška prilikom ažuriranja korisnika:', error);
    throw new AppError('Greška prilikom ažuriranja korisnika.', 500);
  }
};

export const deleteUserByAdmin = async (id: number): Promise<void> => {
  const user = await Korisnik.findByPk(id);
  if (!user) {
    throw new AppError('Korisnik nije pronađen za brisanje.', 404);
  }
  // Ovdje bi se mogla dodati logika da se admin ne može sam obrisati,
  // ili da se ne može obrisati posljednji admin, itd.
  await user.destroy();
}; 