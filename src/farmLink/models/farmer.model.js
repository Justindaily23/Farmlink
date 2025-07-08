import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.Config.js'; // adjust path as necessary

class Farmer extends Model {}

Farmer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // generates a unique UUID
      primaryKey: true,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    produce_preferences: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
      allowNull: true, // Optional during registration
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    farm_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    reset_password_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    sequelize,
    modelName: 'Farmer',
    tableName: 'farmers',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Farmer;
