import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.Config.js'; // adjust path as necessary

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // generates a unique UUID
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30], // minimum and maximum username length
        is: /^[a-zA-Z0-9_]+$/i, // only allow alphanumeric + underscores
      },
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

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_type: {
      type: DataTypes.ENUM('farmer', 'buyer'),
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },

  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;
