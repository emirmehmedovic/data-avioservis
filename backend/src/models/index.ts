import sequelize from '../config/database';
import Firma, { FirmaAttributes } from './Firma';
import Lokacija, { LokacijaAttributes } from './Lokacija';
import Korisnik, { KorisnikAttributes, UserRole } from './Korisnik';
import VoziloOprema, { VoziloOpremaAttributes, StatusVozila } from './VoziloOprema';
import ServisniNalog, { ServisniNalogAttributes } from './ServisniNalog';

// Definiranje asocijacija
// Firma <-> VoziloOprema
Firma.hasMany(VoziloOprema, {
  foreignKey: 'firma_id',
  as: 'vozilaOprema',
});
VoziloOprema.belongsTo(Firma, {
  foreignKey: 'firma_id',
  as: 'firma',
});

// Lokacija <-> VoziloOprema
Lokacija.hasMany(VoziloOprema, {
  foreignKey: 'lokacija_id',
  as: 'vozilaOprema',
});
VoziloOprema.belongsTo(Lokacija, {
  foreignKey: 'lokacija_id',
  as: 'lokacija',
});

// VoziloOprema <-> ServisniNalog
VoziloOprema.hasMany(ServisniNalog, {
  foreignKey: 'vozilo_oprema_id',
  as: 'servisniNalozi',
});
ServisniNalog.belongsTo(VoziloOprema, {
  foreignKey: 'vozilo_oprema_id',
  as: 'voziloOprema',
});

// Opcionalno: Ako želite sinkronizirati bazu pri startu (za razvoj)
// sequelize.sync({ alter: true }) // 'alter: true' pokušava prilagoditi tablice postojećim modelima
//   .then(() => console.log('Database & tables synced!'))
//   .catch(error => console.error('Error syncing database:', error));

export {
  sequelize,
  Firma,
  Lokacija,
  Korisnik,
  VoziloOprema,
  ServisniNalog,
  // Export atributa i enum-a za lakše korištenje u servisima i kontrolerima
  FirmaAttributes,
  LokacijaAttributes,
  KorisnikAttributes,
  UserRole,
  VoziloOpremaAttributes,
  StatusVozila,
  ServisniNalogAttributes
}; 