import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import VoziloOprema from './VoziloOprema';

export interface ServisniNalogAttributes {
  id: number;
  vozilo_oprema_id: number; // Foreign Key
  datum: Date;
  broj_servisni_nalog?: string | null;
  opis_servisa: string;
  utrosak_materijala?: string | null;
  vrijednost?: number | null; // DECIMAL(10, 2)
  ispravnost: boolean;
  napomena?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ServisniNalogCreationAttributes extends Optional<ServisniNalogAttributes, 'id' | 'createdAt' | 'updatedAt' | 'ispravnost'> {}

class ServisniNalog extends Model<ServisniNalogAttributes, ServisniNalogCreationAttributes> implements ServisniNalogAttributes {
  public id!: number;
  public vozilo_oprema_id!: number;
  public datum!: Date;
  public broj_servisni_nalog?: string | null;
  public opis_servisa!: string;
  public utrosak_materijala?: string | null;
  public vrijednost?: number | null;
  public ispravnost!: boolean;
  public napomena?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Definicija asocijacija
  // public static associate(models: any) {
  //   ServisniNalog.belongsTo(models.VoziloOprema, {
  //     foreignKey: 'vozilo_oprema_id',
  //     as: 'voziloOprema'
  //   });
  // }
}

ServisniNalog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vozilo_oprema_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VoziloOprema, // Referenca na model VoziloOprema
        key: 'id',
      },
      // Ključno: Sequelize će automatski pokušati naći vezu preko `broj_tablica_vozila_opreme`
      // ako je to specificirano kao `targetKey` u asocijaciji VoziloOprema.hasMany(ServisniNalog)
      // Ovdje definiramo samo standardni foreign key.
      // Povezivanje preko `broj_tablica_vozila_opreme` će se rješavati u logici servisa prilikom kreiranja naloga
      // ili kroz specifičniju asocijaciju ako je potrebno (što može biti kompleksnije za direktne FK constraintove u bazi).
      // Za sada, držimo se standardnog FK na ID vozila.
    },
    datum: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    broj_servisni_nalog: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opis_servisa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    utrosak_materijala: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vrijednost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    ispravnost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    napomena: {
      type: DataTypes.TEXT,
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
    tableName: 'servisni_nalozi',
  }
);

export default ServisniNalog; 