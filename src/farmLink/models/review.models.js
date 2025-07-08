import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize.Config.js';
import User from '../models/user.model.js';
import Product from '../models/productListing.model.js';
import Order from '../models/order.model.js';

class Review extends Model {}

Review.init(
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
      allowNull: true,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations for easier querying:
Review.belongsTo(User, { as: 'buyer', foreignKey: 'buyerId' });
Review.belongsTo(User, { as: 'farmer', foreignKey: 'farmerId' });
Review.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
Review.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });

export default Review;
