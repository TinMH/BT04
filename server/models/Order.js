import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  coupon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

export default Order;
