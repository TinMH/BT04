import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
});

export default Comment;
