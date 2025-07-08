import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.Config.js';
import Farmer from './farmer.model.js';

class Produce extends Model {}

const STATUS = ['Instock', 'sold_out'];

Produce.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    farmerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    produce_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category is required',
        },
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unit',
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    harvest_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: {
          msg: 'Harvest date is required',
        },
      },
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...STATUS),
      allowNull: true,
      defaultValue: 'Instock',
    },
  },
  {
    sequelize,
    modelName: 'Produce',
    tableName: 'produce',
    underscored: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Setup association - A product belongs to a farmer
Produce.belongsTo(Farmer, { as: 'farmer', foreignKey: 'farmerId' });
Farmer.hasMany(Produce, { as: 'produce', foreignKey: 'farmerId' });

export default Produce;
