# Checklista za Razvoj Aplikacije za Evidenciju Stanja Vozila

## Priprema Okruženja i Osnovne Postavke

### Backend
- [X] Kreirati `backend` folder.
- [X] Kreirati `package.json` (`npm init -y`).
- [X] Instalirati proizvodne zavisnosti (`express`, `sequelize`, `pg`, `pg-hstore`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `cors`, `date-fns`).
- [X] Instalirati razvojne zavisnosti (`typescript`, `@types/*`, `ts-node`, `nodemon`).
- [X] Kreirati i konfigurirati `tsconfig.json`.
- [X] Postaviti skripte u `package.json` (`build`, `start`, `dev`).
- [X] Kreirati osnovnu strukturu foldera (`src`, `src/config`, `src/models`, itd.).
- [X] Kreirati `.env.example`.
- [X] Kreirati `.gitignore`.
- [X] Korisnik ručno kreirao `.env` i unio podatke.

### Baza Podataka (PostgreSQL)
- [X] Osigurati da je PostgreSQL server pokrenut (Homebrew service).
- [X] Spojiti se na PostgreSQL kao superuser.
- [X] Kreirati bazu podataka (`vehicle_maintenance_db`).
- [X] Kreirati dediciranog korisnika za aplikaciju (`vehicle_app_user` s lozinkom).
- [X] Dodijeliti privilegije novom korisniku nad bazom.
- [X] Ažurirati `DATABASE_URL` u `backend/.env` s konekcijskim stringom.

### Frontend
- [X] **Odlučiti o načinu kreiranja frontend projekta.**
- [X] Kreirati `frontend` folder i React (Vite + TypeScript) projekat.
- [X] Instalirati potrebne frontend zavisnosti.
- [X] Konfigurirati Tailwind CSS.

## Backend (Node.js, Express.js, TypeScript, Sequelize, PostgreSQL, JWT)

### Sequelize Postavke
- [X] Kreirati `src/config/database.ts`.
- [X] Definirati Sequelize model: `Firma` (`src/models/Firma.ts`).
- [X] Definirati Sequelize model: `Lokacija` (`src/models/Lokacija.ts`).
- [X] Definirati Sequelize model: `Korisnik` (`src/models/Korisnik.ts`) (s bcrypt hookom).
- [X] Definirati Sequelize model: `VoziloOprema` (`src/models/VoziloOprema.ts`).
- [X] Definirati Sequelize model: `ServisniNalog` (`src/models/ServisniNalog.ts`).
- [X] Postaviti asocijacije između modela i kreirati `src/models/index.ts`.

### Glavni Aplikacijski Fajl (`src/server.ts`)
- [X] Kreirati `src/server.ts`.
- [X] Uključiti osnovne middlewaree (CORS, parsers).
- [X] Postaviti funkciju za pokretanje servera i konekciju na bazu.

### Utility
- [X] Kreirati `src/utils/AppError.ts` i `catchAsync.ts`.

### Autentikacija (JWT)
- [X] Kreirati `src/services/authService.ts` (login logika).
- [X] Kreirati kontroler za autentikaciju (`src/controllers/authController.ts`).
- [X] Kreirati rute za autentikaciju (`src/routes/authRoutes.ts`).
- [X] Kreirati middleware za autentikaciju (`src/middlewares/authMiddleware.ts` - `protect`, `restrictTo`).
- [X] Integrirati rute za autentikaciju u `src/server.ts`.
- [ ] Riješiti `expiresIn` problem kod JWT-a u `authService.ts` (privremeno komentirano).

### CRUD Operacije
- **Firma**
  - [X] Kreirati `src/services/firmaService.ts`.
  - [X] Kreirati `src/controllers/firmaController.ts`.
  - [X] Kreirati `src/routes/firmaRoutes.ts`.
  - [X] Integrirati rute u `src/server.ts` (sa zaštitom).
- **Lokacija**
  - [X] Kreirati `src/services/lokacijaService.ts`.
  - [X] Kreirati `src/controllers/lokacijaController.ts`.
  - [X] Kreirati `src/routes/lokacijaRoutes.ts`.
  - [X] Integrirati rute u `src/server.ts` (sa zaštitom).
- **Korisnik (Upravljanje)**
  - [X] Kreirati `src/services/userService.ts` (uključujući `createUserByAdmin`).
  - [X] Kreirati `src/controllers/userController.ts`.
  - [X] Kreirati `src/routes/userRoutes.ts`.
  - [X] Integrirati rute u `src/server.ts` (sa zaštitom).
- **VoziloOprema**
  - [X] Kreirati `src/services/voziloOpremaService.ts`.
  - [X] Implementirati logiku za **izračunata polja** unutar `voziloOpremaService.ts` (`dodajIzracunataPolja`).
  - [X] Kreirati `src/controllers/voziloOpremaController.ts`.
  - [X] Kreirati `src/routes/voziloOpremaRoutes.ts`.
  - [X] Integrirati rute u `src/server.ts` (sa zaštitom).
  - [X] **RIJEŠITI:** Linter/TypeScript greške u `voziloOpremaController.ts` koje sprječavaju pokretanje servera.
- **ServisniNalog**
  - [X] Kreirati `src/services/servisniNalogService.ts`.
  - [X] Kreirati `src/controllers/servisniNalogController.ts`.
  - [X] Kreirati `src/routes/servisniNalogRoutes.ts`.
  - [X] Integrirati rute u `src/server.ts` (sa zaštitom).

### Validacija Ulaznih Podataka
- [ ] Odabrati i implementirati strategiju validacije (npr. `zod`) za sve CRUD operacije i autentikaciju na backendu.

### Tipovi i DTO
- [X] Definirati/organizirati precizne TypeScript interfejse/DTO-ove u `src/types` ili unutar servisnih/model datoteka (djelomično napravljeno).

## Frontend (React, TypeScript, Tailwind CSS, Axios, React Hook Form + Zod)

### Osnovna Struktura Projekta (Vite)
- [X] Odabran tehnološki stog (React Hook Form & Zod).
- [X] Kreiran `frontend` direktorij.
- [X] Inicijaliziran React + TypeScript projekt s Vite (`package.json` kreiran).
- [X] Instalirane osnovne ovisnosti (`axios`, `react-router-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `react-hook-form`, `zod`, `@types/react-router-dom`, `lucide-react`).
- [X] Instaliran `@hookform/resolvers`.
- [X] Kreirana osnovna struktura foldera (`frontend/src/components`, `pages`, `services`, `hooks`, `contexts`, `utils`, `assets`, `router`, `layouts`, `config`, `types`).
- [X] Očišćen Vite demo sadržaj (`App.css`, `assets/react.svg`, default `App.tsx` sadržaj).

### Stiliziranje (Tailwind CSS)
- [X] Instaliran i konfiguriran Tailwind CSS (uključujući `@tailwindcss/postcss`).
- [X] Kreirani `tailwind.config.js` i `postcss.config.js` (ručno zbog `npx` problema).
- [X] Tailwind direktive dodane u `frontend/src/index.css`.

### Navigacija (React Router)
- [X] Postavljena osnovna konfiguracija ruta u `frontend/src/router/index.tsx`.
- [X] `App.tsx` konfiguriran da koristi `AppRouter`.
- [X] `main.tsx` potvrđen za renderiranje `App` komponente.

### API Servis (Axios)
- [X] Kreiran `frontend/src/config/api.ts` (konfigurirana Axios instanca).
- [X] Kreirana `.env` datoteka u `frontend` s `VITE_API_BASE_URL`.

### Frontend Autentikacija - Login Stranica
- [X] Kreirana komponenta `frontend/src/pages/LoginPage.tsx`.
- [X] `LoginPage` povezana s routerom.
- [X] Implementirana login forma s `react-hook-form` i `zod` za validaciju.
- [X] Kreiran `frontend/src/services/authService.ts` s `loginUser` funkcijom.
- [X] `LoginPage.tsx` povezana s `authService.ts` za slanje login zahtjeva na backend.
- [X] Dodan prikaz grešaka s backenda na `LoginPage.tsx`.

### Globalno Stanje Autentikacije
- [X] Kreirati `AuthContext` (ili drugi state management npr. Zustand/Redux Toolkit) za upravljanje stanjem prijave, tokenom i korisničkim podacima.
- [X] Implementirati logiku za spremanje JWT tokena (npr. `localStorage`) i automatsko dodavanje u Axios headere.
- [X] Implementirati logiku odjave (logout).

### Zaštićene Rute i Layouti
- [X] Kreirati komponentu za zaštićene rute (`ProtectedRoute.tsx` ili slično).
- [X] Kreirati osnovni `AdminLayout.tsx` (ili `DashboardLayout.tsx`) za stranice nakon prijave.
- [X] Integrirati layout i zaštićene rute u `router/index.tsx`.

### Admin Dashboard Stranice (CRUD)
- [X] **Vozila/Oprema Stranica**
  - [X] Kreirati `VozilaOpremaPage.tsx`.
  - [X] Prikaz tablice s vozilima/opremom (koristeći `react-table` ili custom).
  - [X] Forma za dodavanje/izmjenu vozila/opreme.
  - [X] Prikaz izračunatih polja.
  - [X] Paginacija, sortiranje, filtriranje.
- [X] **Servisni Nalozi Stranica**
  - [X] Kreirati `ServisniNaloziPage.tsx`.
  - [X] Prikaz tablice servisnih naloga.
  - [X] Forma za dodavanje/izmjenu servisnih naloga.
  - [X] Paginacija, sortiranje, filtriranje.
- [X] **Firme Stranica**
  - [X] Kreirati `services/firmaService.ts`.
  - [X] Kreirati `FirmePage.tsx`.
  - [X] CRUD operacije za firme.
- [X] **Lokacije Stranica**
  - [X] Kreirati `services/lokacijaService.ts`.
  - [X] Kreirati `LokacijePage.tsx`.
  - [X] CRUD operacije za lokacije.
- [X] **Korisnici Stranica (Admin only)**
  - [X] Kreirati `services/userService.ts`.
  - [X] Kreirati `KorisniciPage.tsx`.
  - [X] Kreirati `components/KorisniciForm.tsx`.
  - [X] CRUD operacije za korisnike.

### Općenito Frontend
- [ ] Dizajn i UI/UX poboljšanja za admin dashboard.
- [X] Implementacija globalnog rukovanja greškama i notifikacija (npr. `react-toastify`).
- [X] Definirati TypeScript tipove/interfejse za sve entitete i API odgovore na frontendu.
- [X] Dodavanje ikonica (`lucide-react`) gdje je prikladno.
- [X] Razmotriti komponente za višekratnu upotrebu (`components` folder).

### Bugfiksevi i Poboljšanja
- [X] Riješiti linter greške u `LokacijaForm.tsx` komponenti.
- [X] Riješiti linter greške u `ServisniNalogForm.tsx` komponenti.
- [X] Riješiti linter greške u `KorisniciForm.tsx` komponenti.
- [X] Dodati brisanje potvrdu prije brisanja itema.
- [X] Implementirati globalni handler za API greške.

## Nova funkcionalnost - Detalji vozila/opreme i izvještaji
- [X] **Detaljna stranica vozila/opreme**
  - [X] Kreirati `VoziloOpremaDetalji` komponentu ili modal
  - [X] Implementirati prikaz svih podataka o vozilu/opremi u detaljnom pogledu
  - [X] Napraviti tabove ili sekcije za pregledniji prikaz različitih kategorija podataka
  - [X] Dodati gumb za otvaranje detaljnog pogleda u tablici vozila/opreme
  
- [X] **Prikaz servisnih naloga povezanih s vozilom**
  - [X] Dohvatiti servisne naloge filtrirane po ID-u vozila iz backend API-ja
  - [X] Prikazati servisne naloge u detaljnom pogledu vozila
  - [X] Implementirati mini-tablicu s paginacijom za servisne naloge
  - [X] Dodati mogućnost filtriranja servisnih naloga po datumu, opisu i drugim atributima
  
- [X] **Vremenska linija servisa i povijesti održavanja**
  - [X] Kreirati vizualnu komponentu vremenske linije za pregled povijesti servisa
  - [X] Prikazati ključne događaje održavanja vozila kronološkim redoslijedom
  - [X] Implementirati interaktivne elemente za prikaz dodatnih informacija o određenom servisu
  
- [X] **Izvještaji održavanja**
  - [X] Dodati kontrole za generiranje izvještaja (izbor vremenskog raspona, vrsta izvještaja)
  - [X] Implementirati backend API endpoint za generiranje izvještaja
  - [X] Kreirati servis na frontendu za pozivanje API-ja za izvještaje
  - [X] Implementirati preuzimanje izvještaja u različitim formatima (PDF, Excel)
  - [X] Dodati opciju za pregled izvještaja u web sučelju prije preuzimanja 