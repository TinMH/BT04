import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
});

export default Category;
