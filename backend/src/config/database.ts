import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log SQL queries in development
  dialectOptions: {
    // Ovdje možete dodati SSL konfiguraciju ako je potrebna za produkciju
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false // Ovisno o vašem SSL certifikatu
    // }
  },
  define: {
    timestamps: true, // Automatski dodaje createdAt i updatedAt
    underscored: true, // Koristi snake_case za automatski generirana polja (npr. foreign keys)
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Opcionalno: Sinkroniziraj modele s bazom (koristiti s oprezom u produkciji)
    // await sequelize.sync({ alter: true }); // alter: true pokušava izmijeniti tablice da odgovaraju modelima
    // console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize; 