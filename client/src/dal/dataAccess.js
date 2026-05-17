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
  createOrder: async (cart, appliedCoupon, shippingInfo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, appliedCoupon, shippingInfo })
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
  }
};

export const CartRepository = {
  // Load persistent cart items
  loadCart: () => {
    const saved = localStorage.getItem('forge_cart');
    return saved ? JSON.parse(saved) : [];
  },

  // Save cart state
  saveCart: (cart) => {
    localStorage.setItem('forge_cart', JSON.stringify(cart));
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
