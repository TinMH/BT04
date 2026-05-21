import { ProductRepository, PromotionRepository, MemberRepository, OrderRepository } from '../dal/dataAccess';

// --- BUSINESS LOGIC LAYER (BLL) ---
// Contains pure JavaScript service functions enforcing business rules, 
// calculations, filtering, and validation algorithms.

export const ProductFilterService = {
  // Enforces complex search & multi-condition filter calculations
  filterAndSort: (products, { 
    searchQuery = '', 
    categoryId = 'all', 
    priceFilter = 5000000, 
    sizeFilter = 'all', 
    switchFilter = 'all', 
    connectivityFilter = 'all', 
    tagFilter = 'all', 
    sortBy = 'featured' 
  }) => {
    return products.filter((product) => {
      // 1. Text Search matching
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesTagline = product.tagline.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesFeatures = product.features.toLowerCase().includes(query);
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesFeatures) {
          return false;
        }
      }

      // 2. Category selection
      if (categoryId !== 'all' && product.categoryId !== categoryId) {
        return false;
      }

      // 3. Price limit
      if (product.price > priceFilter) {
        return false;
      }

      // 4. Keyboard Layout Size
      if (sizeFilter !== 'all') {
        if (sizeFilter === '60%' && product.size !== '60%') return false;
        if (sizeFilter === '65%' && product.size !== '65%') return false;
        if (sizeFilter === '75%' && product.size !== '75%') return false;
        if (sizeFilter === '80% TKL' && product.size !== '80% (TKL)') return false;
        if (sizeFilter === 'Fullsize' && !product.size.includes('Fullsize')) return false;
        if (sizeFilter === 'Ergonomic' && !product.size.includes('Alice')) return false;
      }

      // 5. Switch Type
      if (switchFilter !== 'all') {
        const pSwitch = product.switchType.toLowerCase();
        if (switchFilter === 'linear' && !pSwitch.includes('linear')) return false;
        if (switchFilter === 'tactile' && !pSwitch.includes('tactile')) return false;
        if (switchFilter === 'clicky' && !pSwitch.includes('clicky')) return false;
      }

      // 6. Connectivity Mode
      if (connectivityFilter !== 'all') {
        const pConn = product.connectivity.toLowerCase();
        if (connectivityFilter === 'wireless' && !pConn.includes('3 chế độ') && !pConn.includes('bluetooth')) return false;
        if (connectivityFilter === 'wired' && pConn.includes('dây type-c rời') && !pConn.includes('3 chế độ')) return false;
      }

      // 7. Special tags (Bán chạy nhất, mới nhất, khuyến mãi)
      if (tagFilter !== 'all' && !product.tags.includes(tagFilter)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting strategies
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sold') return b.soldCount - a.soldCount;
      return 0; // default featured array order
    });
  }
};

export const CartService = {
  // Validate stock bounds when adding products to shopping cart
  validateAddToCart: (product, configSwitch, configColorway, qtyRequested, currentCart) => {
    if (product.stock === 0) {
      throw new Error('Sản phẩm này hiện tại đã hết hàng!');
    }

    const itemInCart = currentCart.find(
      item => item.product.id === product.id && 
      item.switchType === configSwitch && 
      item.colorway === configColorway
    );

    const totalQtyRequested = (itemInCart?.quantity || 0) + qtyRequested;
    if (totalQtyRequested > product.stock) {
      throw new Error(`Kho hàng chỉ còn ${product.stock} chiếc. Bạn đã có ${itemInCart?.quantity || 0} chiếc trong giỏ hàng. Không thể đặt thêm!`);
    }

    return true;
  },

  // Perform dynamic order calculations
  calculateBill: (cart, appliedCoupon) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    let discount = 0;
    
    if (appliedCoupon) {
      if (subtotal >= appliedCoupon.minPurchase) {
        discount = Math.floor(subtotal * (appliedCoupon.discount / 100));
      }
    }

    const shipping = 0; // Free delivery incentive
    const total = subtotal - discount + shipping;

    return {
      subtotal,
      discount,
      shipping,
      total
    };
  },

  // Verify and apply promotion codes
  verifyCoupon: (code, subtotal, promotions) => {
    const promo = promotions.find(p => p.id === code.trim().toUpperCase());
    if (!promo) {
      throw new Error('Mã giảm giá không chính xác hoặc đã hết hạn.');
    }
    if (subtotal < promo.minPurchase) {
      throw new Error(`Đơn hàng tối thiểu từ ${promo.minPurchase.toLocaleString()}đ mới đủ điều kiện áp dụng mã này.`);
    }
    return promo;
  }
};

export const CheckoutService = {
  // Validate recipient shipping credentials
  validateShipping: (name, phone, address) => {
    if (!name.trim()) {
      throw new Error('Vui lòng nhập Tên người nhận hàng.');
    }
    if (!phone.trim() || !/^\d{9,11}$/.test(phone.trim())) {
      throw new Error('Số điện thoại không hợp lệ (yêu cầu từ 9 đến 11 số).');
    }
    if (!address.trim()) {
      throw new Error('Vui lòng cung cấp Địa chỉ nhận hàng.');
    }
    return true;
  },

  // Process checkout order using SQLite Database connection
  processOrder: async (cart, appliedCoupon, shippingInfo, username, sessionId, paymentMethod, paymentStatus) => {
    CheckoutService.validateShipping(shippingInfo.name, shippingInfo.phone, shippingInfo.address);
    
    if (cart.length === 0) {
      throw new Error('Giỏ hàng đang trống!');
    }

    // Call database to compile order and update stock
    return await OrderRepository.createOrder(
      cart, 
      appliedCoupon, 
      shippingInfo, 
      username, 
      sessionId, 
      paymentMethod, 
      paymentStatus
    );
  }
};

export const AuthService = {
  // Core user sign-in business validation
  login: async (username, password) => {
    if (!username.trim()) {
      throw new Error('Vui lòng nhập Tên đăng nhập.');
    }
    if (!password) {
      throw new Error('Vui lòng nhập Mật khẩu.');
    }

    // Authenticate through the database
    const member = await MemberRepository.login(username, password);
    return member;
  }
};

export const ReviewService = {
  // Validate and write product review
  submitReview: async (productId, user, rating, content) => {
    if (!user.trim()) {
      throw new Error('Vui lòng cung cấp tên của bạn để gửi đánh giá.');
    }
    if (!content.trim()) {
      throw new Error('Nội dung bình luận nhận xét không được trống.');
    }

    // Store review and recalculate overall score in database
    return await ProductRepository.addComment(productId, {
      user: user.trim(),
      rating: Number(rating),
      content: content.trim()
    });
  }
};

export const OrderTrackingService = {
  // Check cancellation eligibility for an order
  getCancellationStatus: (order) => {
    if (!order) return { canCancelDirect: false, canRequestCancel: false, timeLeftText: '' };
    if (order.status === 6) return { canCancelDirect: false, canRequestCancel: false, timeLeftText: 'Đơn hàng đã được hủy.' };
    if (order.status === 4 || order.status === 5) {
      return { canCancelDirect: false, canRequestCancel: false, timeLeftText: 'Không thể hủy đơn hàng đang giao hoặc đã giao thành công.' };
    }

    const orderTime = new Date(order.createdAt).getTime();
    const elapsedMs = Date.now() - orderTime;
    const elapsedMins = elapsedMs / (60 * 1000);
    const limitMins = 30;

    if (elapsedMins > limitMins) {
      return {
        canCancelDirect: false,
        canRequestCancel: false,
        timeLeftText: 'Đã quá hạn 30 phút để hủy đơn hàng này.'
      };
    }

    const remainingMs = (limitMins * 60 * 1000) - elapsedMs;
    const remMins = Math.floor(remainingMs / (60 * 1000));
    const remSecs = Math.floor((remainingMs % (60 * 1000)) / 1000);
    const timeLeftText = `Thời gian tự hủy còn: ${remMins} phút ${remSecs} giây`;

    if (order.status === 1 || order.status === 2) {
      return {
        canCancelDirect: true,
        canRequestCancel: false,
        timeLeftText
      };
    }

    if (order.status === 3) {
      return {
        canCancelDirect: false,
        canRequestCancel: true,
        timeLeftText: `${timeLeftText} (Cần gửi yêu cầu phê duyệt hủy đơn)`
      };
    }

    return { canCancelDirect: false, canRequestCancel: false, timeLeftText: '' };
  },

  // Map status integer to readable Vietnamese text and color
  getStatusDetails: (status, cancelRequested) => {
    switch (status) {
      case 1:
        return { text: 'Đơn hàng mới', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 2:
        return { text: 'Đã xác nhận', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      case 3:
        return { 
          text: cancelRequested ? 'Đang chuẩn bị (Yêu cầu hủy)' : 'Shop đang chuẩn bị hàng', 
          color: cancelRequested ? 'text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse' : 'text-purple-400 bg-purple-500/10 border-purple-500/20' 
        };
      case 4:
        return { text: 'Đang giao hàng', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
      case 5:
        return { text: 'Đã giao thành công', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 6:
        return { text: 'Đã hủy đơn hàng', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
      default:
        return { text: 'Không xác định', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
    }
  }
};
