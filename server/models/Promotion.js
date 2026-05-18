import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  minPurchase: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  timestamps: false,
});

export default Promotion;
