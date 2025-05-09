import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface za atribute Firma modela
export interface FirmaAttributes {
  id: number;
  naziv: string;
  kontakt_firme?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface za kreiranje nove Firme (id je opcionalan jer ga baza generira)
interface FirmaCreationAttributes extends Optional<FirmaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Firma extends Model<FirmaAttributes, FirmaCreationAttributes> implements FirmaAttributes {
  public id!: number;
  public naziv!: string;
  public kontakt_firme?: string | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Ovdje možete dodati statičke metode ili metode instance ako su potrebne
  // Npr. za definiciju asocijacija
  // public static associate(models: any) {
  //   Firma.hasMany(models.VoziloOprema, {
  //     foreignKey: 'firma_id',
  //     as: 'vozilaOprema'
  //   });
  // }
}

Firma.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    naziv: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    kontakt_firme: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'firme', // Eksplicitno definiranje naziva tablice
    // freezeTableName: true, // Ako ne želite da Sequelize pluralizira naziv modela za tablicu
    // timestamps: true, // Već je globalno definirano u sequelize instanci
  }
);

export default Firma; 