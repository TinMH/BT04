import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  switchType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  colorway: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: false,
});

export default OrderItem;
