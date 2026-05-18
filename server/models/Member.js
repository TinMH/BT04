import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Member = sequelize.define('Member', {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false,
});

export default Member;
