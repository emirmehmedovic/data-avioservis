import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/database';
import Firma from './Firma';
import Lokacija from './Lokacija';

export enum StatusVozila {
  AKTIVAN = 'Aktivan',
  NEAKTIVAN = 'Neaktivan',
  NA_SERVISU = 'Na servisu',
  CEKA_DIJELOVE = 'Čeka dijelove',
}

export interface VoziloOpremaAttributes {
  id: number;
  redni_broj?: number | null;
  status: StatusVozila;
  naziv_vozila_usluge: string;
  firma_id: number; // Foreign Key
  broj_tablica_vozila_opreme: string;
  broj_tablica_prikljucno_vozilo?: string | null;
  lokacija_id: number; // Foreign Key
  vessel_plate_no?: string | null;
  datum_ugradnje_filtera?: Date | null;
  period_vazenja_filtera_mjeseci?: number | null;
  godisnja_inspekcija_datum?: Date | null;
  datum_isteka_filtera_rucno?: Date | null;
  senzor_tehnologija?: string | null;
  ugradjena_servisirana_senzor_datum?: Date | null;
  zamjena_crijeva_hd_63_datum?: Date | null;
  zamjena_crijeva_hd_38_datum?: Date | null;
  zamjena_crijeva_tw_75_datum?: Date | null;
  ispitivanje_crijeva_nepropusnost_datum?: Date | null;
  kalibraza_volumetra_datum?: Date | null;
  umjeravanje_manometara_datum?: Date | null;
  ispitivanje_hecpv_ilcpv_datum?: Date | null;
  tip_filtera_br_plocice?: string | null;
  kontakt_info_vozilo?: string | null;
  napomena?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  // Virtualna polja za izračunate vrijednosti (neće biti u bazi)
  // dana_do_zamjene_filtera?: number;
  // dana_do_inspekcije_filtera?: number;
}

interface VoziloOpremaCreationAttributes extends Optional<VoziloOpremaAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

class VoziloOprema extends Model<VoziloOpremaAttributes, VoziloOpremaCreationAttributes> implements VoziloOpremaAttributes {
  public id!: number;
  public redni_broj?: number | null;
  public status!: StatusVozila;
  public naziv_vozila_usluge!: string;
  public firma_id!: number;
  public broj_tablica_vozila_opreme!: string;
  public broj_tablica_prikljucno_vozilo?: string | null;
  public lokacija_id!: number;
  public vessel_plate_no?: string | null;
  public datum_ugradnje_filtera?: Date | null;
  public period_vazenja_filtera_mjeseci?: number | null;
  public godisnja_inspekcija_datum?: Date | null;
  public datum_isteka_filtera_rucno?: Date | null;
  public senzor_tehnologija?: string | null;
  public ugradjena_servisirana_senzor_datum?: Date | null;
  public zamjena_crijeva_hd_63_datum?: Date | null;
  public zamjena_crijeva_hd_38_datum?: Date | null;
  public zamjena_crijeva_tw_75_datum?: Date | null;
  public ispitivanje_crijeva_nepropusnost_datum?: Date | null;
  public kalibraza_volumetra_datum?: Date | null;
  public umjeravanje_manometara_datum?: Date | null;
  public ispitivanje_hecpv_ilcpv_datum?: Date | null;
  public tip_filtera_br_plocice?: string | null;
  public kontakt_info_vozilo?: string | null;
  public napomena?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Definicija asocijacija
  // public static associate(models: any) {
  //   VoziloOprema.belongsTo(models.Firma, {
  //     foreignKey: 'firma_id',
  //     as: 'firma'
  //   });
  //   VoziloOprema.belongsTo(models.Lokacija, {
  //     foreignKey: 'lokacija_id',
  //     as: 'lokacija'
  //   });
  //   VoziloOprema.hasMany(models.ServisniNalog, {
  //     foreignKey: 'vozilo_oprema_id',
  //     as: 'servisniNalozi'
  //   });
  // }
}

VoziloOprema.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    redni_broj: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StatusVozila)),
      allowNull: false,
      defaultValue: StatusVozila.AKTIVAN,
    },
    naziv_vozila_usluge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firma_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Firma, // Referenca na model Firma
        key: 'id',
      },
    },
    broj_tablica_vozila_opreme: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    broj_tablica_prikljucno_vozilo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lokacija_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lokacija, // Referenca na model Lokacija
        key: 'id',
      },
    },
    vessel_plate_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    datum_ugradnje_filtera: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    period_vazenja_filtera_mjeseci: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    godisnja_inspekcija_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    datum_isteka_filtera_rucno: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    senzor_tehnologija: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ugradjena_servisirana_senzor_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    zamjena_crijeva_hd_63_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    zamjena_crijeva_hd_38_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    zamjena_crijeva_tw_75_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ispitivanje_crijeva_nepropusnost_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    kalibraza_volumetra_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    umjeravanje_manometara_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ispitivanje_hecpv_ilcpv_datum: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    tip_filtera_br_plocice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kontakt_info_vozilo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    napomena: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Ili Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'vozila_oprema',
  }
);

export default VoziloOprema; 