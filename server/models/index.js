import sequelize from '../config/db.js';
import Category from './Category.js';
import Product from './Product.js';
import Comment from './Comment.js';
import Promotion from './Promotion.js';
import Article from './Article.js';
import Member from './Member.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import CartItem from './CartItem.js';


Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Comment, { foreignKey: 'productId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// CartItem Associations
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Member.hasMany(CartItem, { foreignKey: 'username', sourceKey: 'username', onDelete: 'CASCADE' });
CartItem.belongsTo(Member, { foreignKey: 'username', targetKey: 'username' });

// Order-Member Associations
Member.hasMany(Order, { foreignKey: 'username', sourceKey: 'username' });
Order.belongsTo(Member, { foreignKey: 'username', targetKey: 'username' });

export {
  Category,
  Product,
  Comment,
  Promotion,
  Article,
  Member,
  Order,
  OrderItem,
  CartItem,
};

export default {
  Category,
  Product,
  Comment,
  Promotion,
  Article,
  Member,
  Order,
  OrderItem,
  CartItem,
};
