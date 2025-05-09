import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'Admin',
  SERVISER = 'Serviser',
  PREGLEDNIK = 'Preglednik',
}

export interface KorisnikAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string; // Pohranjujemo hash, ne plain text password
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

interface KorisnikCreationAttributes extends Optional<KorisnikAttributes, 'id' | 'createdAt' | 'updatedAt' | 'password_hash'> {
  password: string; // Prilikom kreiranja, primamo plain text password
}

class Korisnik extends Model<KorisnikAttributes, KorisnikCreationAttributes> implements Omit<KorisnikAttributes, 'password_hash'> {
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string; // Skinut 'private' modifikator
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Metoda za provjeru lozinke
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  // Getter da se izbjegne slanje password_hash-a direktno (opcionalno, bolja praksa je to riješiti u toJSON metodi ili u servisima)
  // public get safeUser() {
  //   const { password_hash, ...userWithoutPassword } = this.get();
  //   return userWithoutPassword;
  // }

  // Osigurava da se password_hash ne serijalizira u JSON
  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...attributes } = super.get();
    return attributes;
  }
}

Korisnik.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.PREGLEDNIK,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'korisnici',
    hooks: {
      beforeCreate: async (korisnik: any) => { // Koristimo 'any' ili specificniji tip ako je dostupan za hook
        if (korisnik.password) {
          const salt = await bcrypt.genSalt(10);
          korisnik.password_hash = await bcrypt.hash(korisnik.password, salt);
        }
      },
      beforeUpdate: async (korisnik: any) => {
        if (korisnik.changed('password') && korisnik.password) { // Provjeravamo da li je lozinka promijenjena i da li je data nova
          const salt = await bcrypt.genSalt(10);
          korisnik.password_hash = await bcrypt.hash(korisnik.password, salt);
          // Nakon što je hashirana, originalna 'password' property više nije potrebna u bazi
          // No, Sequelize to obično sam rješava ako 'password' nije definiran kao stupac.
        }
      },
    },
  }
);

export default Korisnik; 