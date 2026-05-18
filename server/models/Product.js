import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  originalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  images: {
    type: DataTypes.TEXT, // Stored as a JSON string
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  soldCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  switchType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  connectivity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tags: {
    type: DataTypes.TEXT, // Stored as a JSON string
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value));
    }
  }
}, {
  timestamps: false,
});

export default Product;
