import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface za atribute Lokacija modela
export interface LokacijaAttributes {
  id: number;
  naziv: string;
  adresa?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface za kreiranje nove Lokacije
interface LokacijaCreationAttributes extends Optional<LokacijaAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Lokacija extends Model<LokacijaAttributes, LokacijaCreationAttributes> implements LokacijaAttributes {
  public id!: number;
  public naziv!: string;
  public adresa?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public static associate(models: any) {
  //   Lokacija.hasMany(models.VoziloOprema, {
  //     foreignKey: 'lokacija_id',
  //     as: 'vozilaOprema'
  //   });
  // }
}

Lokacija.init(
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
    adresa: {
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
    tableName: 'lokacije',
  }
);

export default Lokacija; 