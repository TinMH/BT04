import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { Category, Product, Comment, Promotion, Article, Member, Order, OrderItem } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React app (port 5173 or similar) can make API requests
app.use(cors());
app.use(express.json());

// Helper function to fetch all products with their associated comments
async function getProductsWithComments() {
  return await Product.findAll({
    include: [{
      model: Comment,
      as: 'comments',
    }],
    order: [
      ['id', 'ASC'],
      [{ model: Comment, as: 'comments' }, 'id', 'DESC'] // Newest comments first
    ]
  });
}

// --- API ENDPOINTS ---

// 1. Categories Endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. Promotions Endpoint
app.get('/api/promotions', async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 3. Articles Endpoint
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [['date', 'DESC']]
    });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 4. Products Endpoint
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProductsWithComments();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 5. Submit Product Review Endpoint
app.post('/api/products/:id/comments', async (req, res) => {
  const productId = req.params.id;
  const { user, rating, content } = req.body;

  if (!user || !user.trim()) {
    return res.status(400).json({ message: 'Vui lòng cung cấp tên của bạn để gửi đánh giá.' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Nội dung bình luận nhận xét không được trống.' });
  }
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Số sao đánh giá phải từ 1 đến 5.' });
  }

  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    await Comment.create({
      user: user.trim(),
      rating: Number(rating),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      productId
    }, { transaction });

    const allComments = await Comment.findAll({
      where: { productId },
      transaction
    });

    const sumRatings = allComments.reduce((sum, c) => sum + c.rating, 0);
    const avgRating = parseFloat((sumRatings / allComments.length).toFixed(1));

    product.rating = avgRating;
    await product.save({ transaction });

    await transaction.commit();

    const updatedProducts = await getProductsWithComments();
    res.json(updatedProducts);
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 6. User Authentication Endpoint (Login)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập Tên đăng nhập.' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Vui lòng nhập Mật khẩu.' });
  }

  try {
    const member = await Member.findOne({
      where: {
        username: username.trim()
      }
    });

    if (!member || member.password !== password) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    res.json({
      username: member.username,
      name: member.name,
      role: member.role,
      discountCode: member.discountCode,
      avatar: member.avatar
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 7. Order Placement Endpoint (Checkout)
app.post('/api/orders', async (req, res) => {
  const { cart, appliedCoupon, shippingInfo } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng đang trống!' });
  }

  if (!shippingInfo || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
    return res.status(400).json({ message: 'Thông tin giao hàng không đầy đủ.' });
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Verify stock and calculate invoice values
    let subtotal = 0;
    const orderItemsToCreate = [];
    const productsToUpdate = [];

    for (const item of cart) {
      const product = await Product.findByPk(item.product.id, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `Không tìm thấy sản phẩm ID ${item.product.id}` });
      }

      if (product.stock === 0) {
        await transaction.rollback();
        return res.status(400).json({ message: `Sản phẩm ${product.name} đã hết hàng!` });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ message: `Kho hàng chỉ còn ${product.stock} chiếc cho sản phẩm ${product.name}. Không thể đặt thêm!` });
      }

      // Add to subtotal
      subtotal += product.price * item.quantity;

      // Update product inventory in transaction
      product.stock = Math.max(0, product.stock - item.quantity);
      product.soldCount = product.soldCount + item.quantity;
      productsToUpdate.push(product);

      // Prep order item database entry
      orderItemsToCreate.push({
        productId: product.id,
        switchType: item.switchType,
        colorway: item.colorway,
        quantity: item.quantity
      });
    }

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
      const promo = await Promotion.findByPk(appliedCoupon.id, { transaction });
      if (promo && subtotal >= promo.minPurchase) {
        discount = Math.floor(subtotal * (promo.discount / 100));
      }
    }

    const total = subtotal - discount;
    const orderId = `FGE-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDate = new Date().toLocaleString('vi-VN');

    // 2. Create Order in Database
    const order = await Order.create({
      orderId,
      date: orderDate,
      customerName: shippingInfo.name.trim(),
      customerPhone: shippingInfo.phone.trim(),
      customerAddress: shippingInfo.address.trim(),
      customerNote: shippingInfo.note ? shippingInfo.note.trim() : null,
      subtotal,
      discount,
      coupon: appliedCoupon ? appliedCoupon.id : null,
      total
    }, { transaction });

    // 3. Create OrderItems in Database
    for (const item of orderItemsToCreate) {
      await OrderItem.create({
        orderId,
        ...item
      }, { transaction });
    }

    // 4. Save Product stock deductions
    for (const product of productsToUpdate) {
      await product.save({ transaction });
    }

    await transaction.commit();

    // 5. Build Invoice matching frontend's structure
    const invoice = {
      orderId,
      date: orderDate,
      customer: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        note: shippingInfo.note
      },
      items: cart, // returns same item objects
      subtotal,
      discount,
      coupon: appliedCoupon ? appliedCoupon.id : null,
      total
    };

    // Fetch updated product catalog
    const updatedProducts = await getProductsWithComments();

    res.json({
      invoice,
      updatedProducts
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error during checkout transaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 8. Products by Category (Lazy loading / Pagination) API
app.get('/api/categories/:categoryId/products', async (req, res) => {
  const categoryId = req.params.categoryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4; // default limit is 4 to clearly demonstrate lazy loading
  const offset = (page - 1) * limit;

  try {
    const whereClause = categoryId === 'all' ? {} : { categoryId };

    // Find all matching products with pagination and total count
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: Comment,
        as: 'comments',
      }],
      order: [['id', 'ASC']],
      limit,
      offset
    });

    res.json({
      products,
      totalCount: count,
      page,
      limit,
      hasMore: offset + products.length < count
    });
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 9. Increment Product View Count
app.post('/api/products/:id/view', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }
    product.viewCount = (product.viewCount || 0) + 1;
    await product.save();
    res.json({ success: true, viewCount: product.viewCount });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 10. Top 10 Best Selling Products API
app.get('/api/products/top-selling', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4; // paginated by limit for horizontal pages
  const offset = (page - 1) * limit;
  try {
    // We want the absolute top 10 best-selling items, but sliced according to pagination
    // Fetch all top 10 first to ensure we strictly stay within the Top 10 limits
    const allTopTen = await Product.findAll({
      include: [{
        model: Comment,
        as: 'comments',
      }],
      order: [['soldCount', 'DESC']],
      limit: 10
    });

    const totalCount = allTopTen.length;
    const paginatedProducts = allTopTen.slice(offset, offset + limit);

    res.json({
      products: paginatedProducts,
      totalCount,
      page,
      limit,
      hasMore: offset + paginatedProducts.length < totalCount
    });
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 11. Top 10 Most Viewed Products API
app.get('/api/products/most-viewed', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4; // paginated by limit for horizontal pages
  const offset = (page - 1) * limit;
  try {
    // Fetch all top 10 first to ensure we strictly stay within the Top 10 limits
    const allTopTen = await Product.findAll({
      include: [{
        model: Comment,
        as: 'comments',
      }],
      order: [['viewCount', 'DESC']],
      limit: 10
    });

    const totalCount = allTopTen.length;
    const paginatedProducts = allTopTen.slice(offset, offset + limit);

    res.json({
      products: paginatedProducts,
      totalCount,
      page,
      limit,
      hasMore: offset + paginatedProducts.length < totalCount
    });
  } catch (error) {
    console.error('Error fetching most viewed products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- SERVER INITIALIZATION ---

async function startServer() {
  try {
    // Validate database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 ForgeKeyboards Backend Server running on port ${PORT}`);
      console.log(`👉 API base URL: http://localhost:${PORT}`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
