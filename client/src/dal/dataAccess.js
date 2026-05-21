// --- DATA ACCESS LAYER (DAL) ---
// Handles querying, updating, and persisting e-commerce records from the Node Express / SQLite backend API.

const API_BASE_URL = 'http://localhost:5000/api';

export const ProductRepository = {
  // Get all products from SQLite database
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm');
      return await response.json();
    } catch (e) {
      console.error("Error fetching products", e);
      throw e;
    }
  },

  // Append customer review comments and recalculate ratings
  addComment: async (productId, commentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Lỗi thêm đánh giá');
      }
      return await response.json(); // Returns the fully updated product list
    } catch (e) {
      console.error("Error adding review comment", e);
      throw e;
    }
  },

  // Fetch paginated products by category (for Lazy Loading)
  getProductsByCategory: async (categoryId, page = 1, limit = 4) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/products?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Không thể tải sản phẩm theo danh mục');
      return await response.json(); // Returns { products, totalCount, page, limit, hasMore }
    } catch (e) {
      console.error("Error fetching products by category", e);
      throw e;
    }
  },

  // Increment view count when a product is clicked
  incrementViewCount: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/view`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Không thể tăng lượt xem sản phẩm');
      return await response.json(); // Returns { success: true, viewCount }
    } catch (e) {
      console.error("Error incrementing view count", e);
      throw e;
    }
  },

  // Fetch Top 10 Best Selling products paginated (for horizontal display)
  getTopSellingProducts: async (page = 1, limit = 4) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/top-selling?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Không thể tải sản phẩm bán chạy nhất');
      return await response.json();
    } catch (e) {
      console.error("Error fetching top selling products", e);
      throw e;
    }
  },

  // Fetch Top 10 Most Viewed products paginated (for horizontal display)
  getMostViewedProducts: async (page = 1, limit = 4) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/most-viewed?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Không thể tải sản phẩm xem nhiều nhất');
      return await response.json();
    } catch (e) {
      console.error("Error fetching most viewed products", e);
      throw e;
    }
  }
};

export const CategoryRepository = {
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Không thể tải danh mục sản phẩm');
      return await response.json();
    } catch (e) {
      console.error("Error fetching categories", e);
      throw e;
    }
  }
};

export const PromotionRepository = {
  getAllPromotions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/promotions`);
      if (!response.ok) throw new Error('Không thể tải danh sách khuyến mãi');
      return await response.json();
    } catch (e) {
      console.error("Error fetching promotions", e);
      throw e;
    }
  }
};

export const ArticleRepository = {
  getAllArticles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) throw new Error('Không thể tải bài viết');
      return await response.json();
    } catch (e) {
      console.error("Error fetching articles", e);
      throw e;
    }
  }
};

export const MemberRepository = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Đăng nhập thất bại');
      }
      return await response.json();
    } catch (e) {
      console.error("Error during authentication fetch", e);
      throw e;
    }
  }
};

export const OrderRepository = {
  createOrder: async (cart, appliedCoupon, shippingInfo, username, sessionId, paymentMethod, paymentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, appliedCoupon, shippingInfo, username, sessionId, paymentMethod, paymentStatus })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Đặt hàng thất bại');
      }
      return await response.json(); // Returns { invoice, updatedProducts }
    } catch (e) {
      console.error("Error placing order", e);
      throw e;
    }
  },

  getUserOrders: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders?username=${username}`);
      if (!response.ok) throw new Error('Không thể tải lịch sử đơn hàng');
      return await response.json();
    } catch (e) {
      console.error("Error fetching user orders", e);
      throw e;
    }
  },

  trackOrder: async (orderId, phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/track?orderId=${orderId}&phone=${phone}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Không thể tra cứu đơn hàng');
      }
      return await response.json();
    } catch (e) {
      console.error("Error tracking order", e);
      throw e;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'POST'
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Không thể yêu cầu hủy đơn hàng');
      }
      return await response.json();
    } catch (e) {
      console.error("Error canceling order", e);
      throw e;
    }
  },

  adminGetAllOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`);
      if (!response.ok) throw new Error('Không thể tải toàn bộ đơn hàng (admin)');
      return await response.json();
    } catch (e) {
      console.error("Error getting admin orders", e);
      throw e;
    }
  },

  adminUpdateOrderStatus: async (orderId, status, cancelAction) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, cancelAction })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Không thể cập nhật trạng thái đơn hàng (admin)');
      }
      return await response.json();
    } catch (e) {
      console.error("Error updating admin order status", e);
      throw e;
    }
  }
};

export const CartRepository = {
  getCart: async (username, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart?username=${username || ''}&sessionId=${sessionId || ''}`);
      if (!response.ok) throw new Error('Không thể tải giỏ hàng từ API');
      return await response.json();
    } catch (e) {
      console.error("Error fetching cart from backend", e);
      throw e;
    }
  },

  addToCart: async (username, sessionId, productId, switchType, colorway, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, sessionId, productId, switchType, colorway, quantity })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Không thể thêm vào giỏ hàng');
      }
      return await response.json();
    } catch (e) {
      console.error("Error adding cart item", e);
      throw e;
    }
  },

  updateQty: async (id, quantity, username, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, username, sessionId })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Không thể cập nhật số lượng');
      }
      return await response.json();
    } catch (e) {
      console.error("Error updating cart quantity", e);
      throw e;
    }
  },

  removeItem: async (id, username, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${id}?username=${username || ''}&sessionId=${sessionId || ''}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
      return await response.json();
    } catch (e) {
      console.error("Error deleting cart item", e);
      throw e;
    }
  },

  clearCart: async (username, sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart?username=${username || ''}&sessionId=${sessionId || ''}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Không thể xóa sạch giỏ hàng');
      return await response.json();
    } catch (e) {
      console.error("Error clearing cart", e);
      throw e;
    }
  },

  mergeCart: async (sessionId, username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, username })
      });
      if (!response.ok) throw new Error('Không thể gộp giỏ hàng');
      return await response.json();
    } catch (e) {
      console.error("Error merging cart", e);
      throw e;
    }
  }
};

export const SessionRepository = {
  // Load logged-in member session
  loadSession: () => {
    const saved = localStorage.getItem('forge_user');
    return saved ? JSON.parse(saved) : null;
  },

  // Save session state
  saveSession: (user) => {
    localStorage.setItem('forge_user', JSON.stringify(user));
  },

  // Clear session state
  clearSession: () => {
    localStorage.removeItem('forge_user');
  }
};
