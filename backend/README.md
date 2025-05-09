# Data Avioservis Backend

Backend aplikacija za evidenciju stanja vozila Data Avioservis.

## Instalacija

```bash
npm install
```

## Konfiguracija

Kreirajte `.env` datoteku u korijenu backend direktorija sa sljedećim varijablama:

```env
PORT=3001
DATABASE_URL=postgres://username:password@localhost:5432/data_avioservis
JWT_SECRET=your_jwt_secret_key
```

## Migracije

Za upravljanje bazom podataka koriste se Sequelize migracije. Dostupne su sljedeće naredbe:

```bash
# Pokretanje migracija (kreiranje tablica)
npm run migrate

# Poništavanje posljednje migracije
npm run migrate:undo

# Poništavanje svih migracija
npm run migrate:undo:all

# Kreiranje nove migracije
npm run migration:create ime_migracije
```

## Seederi

Za inicijalno punjenje baze podataka koriste se seederi:

```bash
# Pokreni sve seedere
npm run seed

# Poništi posljednji seeder
npm run seed:undo

# Poništi sve seedere
npm run seed:undo:all
```

## Razvoj

Za pokretanje servera u development modu:

```bash
npm run dev
```

## Produkcija

Za kompajliranje i pokretanje u produkciji:

```bash
npm run build
npm start
``` 