import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.Config.js';
import User from '../models/user.model,js';
import ProductListing from './productListing.model.js';

class Order extends Model {}

const ORDER_STATUS = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'canceled',
];

const PAYMENT_STATUS = ['pending', 'paid', 'failed'];

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    farmerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'product_listings',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    total_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...ORDER_STATUS),
      allowNull: false,
      defaultValue: 'pending',
    },

    payment_status: {
      type: DataTypes.ENUM(...PAYMENT_STATUS),
      allowNull: false,
      defaultValue: 'pending',
    },

    delivery_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'creatted_at',
    updatedAt: 'updated_at',
  }
);

// Associations
Order.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Order.belongsTo(User, { as: 'farmer', foreignKey: 'farmerId ' });
Order.belongsTo(ProductListing, { as: 'product', foreignKey: 'productId' });
