import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import { Category, Product, Comment, Promotion, Article, Member, Order, OrderItem, CartItem } from './models/index.js';

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
  const { cart, appliedCoupon, shippingInfo, username, sessionId, paymentMethod, paymentStatus } = req.body;

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
      total,
      username: username || null,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'Pending',
      status: 1, // Mới
      cancelRequested: false
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

    // 5. Clear cart in database
    if (username) {
      await CartItem.destroy({
        where: { username }
      }, { transaction });
    } else if (sessionId) {
      await CartItem.destroy({
        where: { sessionId }
      }, { transaction });
    }

    await transaction.commit();

    // 6. Build Invoice matching frontend's structure
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
      total,
      username: username || null,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'Pending',
      status: 1
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

// --- CART API ENDPOINTS ---

// A. GET /api/cart
app.get('/api/cart', async (req, res) => {
  const { username, sessionId } = req.query;
  if (!username && !sessionId) {
    return res.status(400).json({ message: 'Vui lòng cung cấp username hoặc sessionId.' });
  }
  try {
    const whereClause = username ? { username } : { sessionId };
    const cartItems = await CartItem.findAll({
      where: whereClause,
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: Comment,
          as: 'comments',
        }]
      }],
      order: [['createdAt', 'ASC']]
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// B. POST /api/cart
app.post('/api/cart', async (req, res) => {
  const { username, sessionId, productId, switchType, colorway, quantity } = req.body;
  if (!productId || !switchType || !colorway) {
    return res.status(400).json({ message: 'Thông tin sản phẩm thêm vào giỏ không đầy đủ.' });
  }
  if (!username && !sessionId) {
    return res.status(400).json({ message: 'Cần có username hoặc sessionId để định danh giỏ hàng.' });
  }
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    const whereClause = username 
      ? { username, productId, switchType, colorway } 
      : { sessionId, productId, switchType, colorway };

    let cartItem = await CartItem.findOne({ where: whereClause });
    const requestQty = quantity || 1;

    if (cartItem) {
      const newQty = cartItem.quantity + requestQty;
      if (newQty > product.stock) {
        return res.status(400).json({ message: `Kho hàng chỉ còn ${product.stock} chiếc. Bạn đang có ${cartItem.quantity} chiếc trong giỏ. Không thể thêm tiếp!` });
      }
      cartItem.quantity = newQty;
      await cartItem.save();
    } else {
      if (requestQty > product.stock) {
        return res.status(400).json({ message: `Kho hàng chỉ còn ${product.stock} chiếc. Không thể đặt thêm!` });
      }
      cartItem = await CartItem.create({
        username: username || null,
        sessionId: sessionId || null,
        productId,
        switchType,
        colorway,
        quantity: requestQty
      });
    }

    // Return the updated cart items
    const queryWhere = username ? { username } : { sessionId };
    const updatedCart = await CartItem.findAll({
      where: queryWhere,
      include: [{ model: Product, as: 'product' }]
    });
    res.json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// C. PUT /api/cart/:id
app.put('/api/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, username, sessionId } = req.body;
  if (quantity === undefined || quantity <= 0) {
    return res.status(400).json({ message: 'Số lượng phải lớn hơn 0.' });
  }
  try {
    const cartItem = await CartItem.findByPk(id, {
      include: [{ model: Product, as: 'product' }]
    });
    if (!cartItem) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng.' });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ message: `Kho hàng chỉ còn ${cartItem.product.stock} chiếc. Không thể tăng thêm!` });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const queryWhere = username ? { username } : { sessionId: sessionId || cartItem.sessionId };
    const updatedCart = await CartItem.findAll({
      where: queryWhere,
      include: [{ model: Product, as: 'product' }]
    });
    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// D. DELETE /api/cart/:id
app.delete('/api/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { username, sessionId } = req.query;
  try {
    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng.' });
    }
    const backupSessionId = cartItem.sessionId;
    const backupUsername = cartItem.username;

    await cartItem.destroy();

    const queryWhere = username ? { username } : { sessionId: sessionId || backupSessionId };
    const updatedCart = await CartItem.findAll({
      where: queryWhere,
      include: [{ model: Product, as: 'product' }]
    });
    res.json(updatedCart);
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// E. POST /api/cart/merge
app.post('/api/cart/merge', async (req, res) => {
  const { sessionId, username } = req.body;
  if (!sessionId || !username) {
    return res.status(400).json({ message: 'Thiếu thông tin sessionId hoặc username để gộp giỏ hàng.' });
  }
  const transaction = await sequelize.transaction();
  try {
    // Get all items in guest cart
    const guestItems = await CartItem.findAll({ where: { sessionId }, transaction });
    for (const guestItem of guestItems) {
      // Find matching item in user cart
      const userItem = await CartItem.findOne({
        where: {
          username,
          productId: guestItem.productId,
          switchType: guestItem.switchType,
          colorway: guestItem.colorway
        },
        transaction
      });

      const product = await Product.findByPk(guestItem.productId, { transaction });
      const maxStock = product ? product.stock : 999;

      if (userItem) {
        // Merge quantities
        const mergedQty = Math.min(maxStock, userItem.quantity + guestItem.quantity);
        userItem.quantity = mergedQty;
        await userItem.save({ transaction });
        // Delete guest item
        await guestItem.destroy({ transaction });
      } else {
        // Associate guest item with user
        guestItem.username = username;
        guestItem.sessionId = null;
        await guestItem.save({ transaction });
      }
    }
    await transaction.commit();

    const updatedCart = await CartItem.findAll({
      where: { username },
      include: [{ model: Product, as: 'product' }]
    });
    res.json(updatedCart);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error merging cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// F. DELETE /api/cart (Clear Cart)
app.delete('/api/cart', async (req, res) => {
  const { username, sessionId } = req.query;
  if (!username && !sessionId) {
    return res.status(400).json({ message: 'Thiếu định danh giỏ hàng để xóa sạch.' });
  }
  try {
    const whereClause = username ? { username } : { sessionId };
    await CartItem.destroy({ where: whereClause });
    res.json([]);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- ORDER & TRACKING API ENDPOINTS ---

// Helper: Auto-confirm orders older than 30 mins
async function autoConfirmOrders() {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await Order.update(
      { status: 2 },
      {
        where: {
          status: 1,
          createdAt: {
            [sequelize.Sequelize.Op.lt]: thirtyMinutesAgo
          }
        }
      }
    );
  } catch (error) {
    console.error('Error in autoConfirmOrders:', error);
  }
}

// G. GET /api/orders (Lịch sử đơn hàng của User)
app.get('/api/orders', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Vui lòng cung cấp username.' });
  }
  try {
    await autoConfirmOrders();
    const orders = await Order.findAll({
      where: { username },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// H. GET /api/orders/track (Tra cứu đơn hàng)
app.get('/api/orders/track', async (req, res) => {
  const { orderId, phone } = req.query;
  if (!orderId || !phone) {
    return res.status(400).json({ message: 'Thiếu mã đơn hàng hoặc số điện thoại để tra cứu.' });
  }
  try {
    await autoConfirmOrders();
    const order = await Order.findOne({
      where: {
        orderId: orderId.trim(),
        customerPhone: phone.trim()
      },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng với thông tin cung cấp.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// I. POST /api/orders/:id/cancel (Yêu cầu hủy đơn hàng)
app.post('/api/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    if (order.status === 6) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Đơn hàng này đã được hủy.' });
    }

    // Check timeframe: must be within 30 minutes of creation
    const orderTime = new Date(order.createdAt).getTime();
    const timeDiffMins = (Date.now() - orderTime) / (60 * 1000);

    if (timeDiffMins > 30) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Thời hạn hủy đơn đã vượt quá 30 phút. Bạn không thể hủy đơn hàng này.' });
    }

    // Status checks
    if (order.status === 1 || order.status === 2) {
      // Direct cancel
      order.status = 6;
      await order.save({ transaction });

      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          product.stock = product.stock + item.quantity;
          product.soldCount = Math.max(0, product.soldCount - item.quantity);
          await product.save({ transaction });
        }
      }

      await transaction.commit();
      res.json({ message: 'Hủy đơn hàng thành công và đã hoàn kho.', order });
    } else if (order.status === 3) {
      // Send cancel request
      order.cancelRequested = true;
      await order.save({ transaction });
      await transaction.commit();
      res.json({ message: 'Đơn hàng đang chuẩn bị. Đã gửi yêu cầu hủy đơn cho shop phê duyệt.', order });
    } else {
      await transaction.rollback();
      return res.status(400).json({ message: 'Đơn hàng đang giao hoặc đã giao thành công. Không thể hủy đơn.' });
    }

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- ADMIN API ENDPOINTS ---

// J. GET /api/admin/orders (Admin lấy tất cả đơn hàng)
app.get('/api/admin/orders', async (req, res) => {
  try {
    await autoConfirmOrders();
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// K. PUT /api/admin/orders/:id/status (Admin cập nhật trạng thái đơn hàng)
app.put('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, cancelAction } = req.body; // cancelAction: 'approve' or 'reject'
  
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    if (cancelAction) {
      if (cancelAction === 'approve') {
        order.status = 6;
        order.cancelRequested = false;
        await order.save({ transaction });

        // Restore stock
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, { transaction });
          if (product) {
            product.stock = product.stock + item.quantity;
            product.soldCount = Math.max(0, product.soldCount - item.quantity);
            await product.save({ transaction });
          }
        }

        await transaction.commit();
        return res.json({ message: 'Đã phê duyệt yêu cầu hủy đơn hàng. Tồn kho đã hoàn lại.', order });
      } else if (cancelAction === 'reject') {
        order.cancelRequested = false;
        await order.save({ transaction });
        await transaction.commit();
        return res.json({ message: 'Đã từ chối yêu cầu hủy đơn hàng.', order });
      }
    }

    if (status !== undefined) {
      const oldStatus = order.status;
      order.status = Number(status);
      
      // If changing directly to canceled, restore stock
      if (Number(status) === 6 && oldStatus !== 6) {
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, { transaction });
          if (product) {
            product.stock = product.stock + item.quantity;
            product.soldCount = Math.max(0, product.soldCount - item.quantity);
            await product.save({ transaction });
          }
        }
      }
      await order.save({ transaction });
      await transaction.commit();
      return res.json({ message: `Đã cập nhật trạng thái đơn hàng thành công.`, order });
    }

    await transaction.rollback();
    res.status(400).json({ message: 'Yêu cầu không hợp lệ.' });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error updating order status:', error);
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
