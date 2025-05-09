import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/database';
import { sequelize, Korisnik, UserRole } from './models';
// Import ruta (bit će kreirane kasnije)
import authRoutes from './routes/authRoutes';
import firmaRoutes from './routes/firmaRoutes'; // Dodan import za firma rute
import lokacijaRoutes from './routes/lokacijaRoutes'; // Dodan import za lokacija rute
import userRoutes from './routes/userRoutes'; // Dodan import za user rute
import voziloOpremaRoutes from './routes/voziloOpremaRoutes'; // Dodan import za voziloOprema rute
import servisniNalogRoutes from './routes/servisniNalogRoutes'; // Dodan import za servisniNalog rute
import izvjestajRoutes from './routes/izvjestajRoutes'; // Dodan import za izvještaj rute
// import lokacijaRoutes from './routes/lokacijaRoutes';
// import voziloOpremaRoutes from './routes/voziloOpremaRoutes';
// import servisniNalogRoutes from './routes/servisniNalogRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Omogućava CORS za sve rute
app.use(express.json()); // Parser za JSON request body
app.use(express.urlencoded({ extended: true })); // Parser za URL-encoded request body

// Osnovna ruta za testiranje
app.get('/', (req: Request, res: Response) => {
  res.send('Backend server radi!');
});

// Registracija ruta
app.use('/api/auth', authRoutes);
app.use('/api/firme', firmaRoutes); // Dodane firma rute
app.use('/api/lokacije', lokacijaRoutes); // Dodane lokacije rute
app.use('/api/users', userRoutes); // Dodane user rute
app.use('/api/vozila-oprema', voziloOpremaRoutes); // Dodane voziloOprema rute
app.use('/api/servisni-nalozi', servisniNalogRoutes); // Dodane servisniNalog rute
app.use('/api/izvjestaji', izvjestajRoutes); // Dodane izvještaj rute

// Globalni Error Handler Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  // Ovdje možete dodati specifičnije rukovanje greškama
  // Na primjer, provjeriti da li je greška instanca neke poznate klase grešaka
  // if (err instanceof MyCustomError) {
  //   return res.status(err.statusCode).json({ message: err.message });
  // }
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const startServer = async () => {
  try {
    await connectDB(); // Povezivanje s bazom
    
    // Removed syncing with { force: true } since we'll use migrations instead
    // Comment out or remove the sync call entirely when using migrations
    // await sequelize.sync();
    // console.log('Database synchronized successfully');

    // Create a default admin user only if it doesn't exist
    try {
      const existingAdmin = await Korisnik.findOne({ where: { email: 'admin@admin.com' } });
      
      if (!existingAdmin) {
        // Generate salt and hash password manually
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash('admin123', salt);
        
        // Create user with both password and hashed password
        const adminUser = await Korisnik.create({
          username: 'admin',
          email: 'admin@admin.com',
          password: 'admin123', // Required for the interface
          password_hash: password_hash, // Manually set the hash
          role: UserRole.ADMIN
        } as any); // Type assertion to bypass TypeScript check
        console.log('Default admin user created:', adminUser.email);
      }
    } catch (error) {
      console.error('Error creating default admin user:', error);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();

export default app; // Export app za testiranje ili druge svrhe 