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
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'COD',
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // 1: Mới, 2: Đã xác nhận, 3: Đang chuẩn bị hàng, 4: Đang giao, 5: Đã giao thành công, 6: Đã hủy
  },
  cancelRequested: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  timestamps: true,
});

export default Order;
