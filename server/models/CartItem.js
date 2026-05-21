import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
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
    defaultValue: 1,
  }
}, {
  timestamps: true,
});

export default CartItem;
