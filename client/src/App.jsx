import React, { useState, useEffect } from 'react';
import { 
  ProductRepository, 
  CategoryRepository, 
  PromotionRepository, 
  ArticleRepository, 
  CartRepository, 
  SessionRepository 
} from './dal/dataAccess';
import { 
  ProductFilterService, 
  CartService, 
  CheckoutService, 
  AuthService, 
  ReviewService 
} from './bll/businessLogic';

// Presentation Layer Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Promotions from './components/Promotions';
import ProductFilters from './components/ProductFilters';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import ArticleDetail from './components/ArticleDetail';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import InvoiceModal from './components/InvoiceModal';
import CategoryLazyLoad from './components/CategoryLazyLoad';
import TopProductsHorizontal from './components/TopProductsHorizontal';
import PaymentSimModal from './components/PaymentSimModal';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';

// Icons for App Layout
import { 
  SlidersHorizontal, RefreshCw, Star, 
  ArrowRight, BookOpen, Clock, Heart, Shield 
} from 'lucide-react';

export default function App() {
  // --- STATE LAYER (PL COORDINATION) ---
  
  // Navigation Routing Triggers
  const [view, setView] = useState('home'); // 'home', 'product', 'article'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // Core Data source states (hydrated from DAL)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [articles, setArticles] = useState([]);

  // Multi-condition Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState(5000000);
  const [sizeFilter, setSizeFilter] = useState('all');
  const [switchFilter, setSwitchFilter] = useState('all');
  const [connectivityFilter, setConnectivityFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Authentication states
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Product detail configurator states
  const [configSwitch, setConfigSwitch] = useState('Linear (Êm Ái, Trơn Tru)');
  const [configColorway, setConfigColorway] = useState('Obsidian Black');
  const [quantity, setQuantity] = useState(1);
  const [detailTab, setDetailTab] = useState('specs'); // 'specs', 'reviews', 'description'

  // Dynamic review comments state
  const [commentUser, setCommentUser] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');

  // Shopping Cart & simulated billing states
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Delivery shipping form states
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingNote, setShippingNote] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);

  // App Session Guest identification & payment simulation states
  const [sessionId, setSessionId] = useState('');
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Flash Sale Countdown timers
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  // --- EFFECT HYDRATION (DAL INVOCATIONS) ---
  
  useEffect(() => {
    // Generate/Load sessionId first
    let sessId = localStorage.getItem('forge_session_id');
    if (!sessId) {
      sessId = 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('forge_session_id', sessId);
    }
    setSessionId(sessId);

    // Load databases in DAL asynchronously from SQLite Express API
    const loadData = async () => {
      try {
        const [pData, cData, prData, aData] = await Promise.all([
          ProductRepository.getAllProducts(),
          CategoryRepository.getAllCategories(),
          PromotionRepository.getAllPromotions(),
          ArticleRepository.getAllArticles()
        ]);

        setProducts(pData);
        setCategories(cData);
        setPromotions(prData);
        setArticles(aData);

        // Read active user session
        let activeUser = null;
        const session = SessionRepository.loadSession();
        if (session) {
          activeUser = session;
          setCurrentUser(session);
          setCommentUser(session.name);
          
          // Auto-validate and apply VIP coupons for logged-in VIPs
          if (session.role.includes('VIP')) {
            const vipPromo = prData.find(promo => promo.id === 'VIPMEM');
            if (vipPromo) {
              setAppliedCoupon(vipPromo);
            }
          }
        }

        // Fetch Cart from API using username or sessionId
        const initialCart = await CartRepository.getCart(activeUser?.username, sessId);
        setCart(initialCart);
      } catch (error) {
        console.error("Error loading initial data from database backend:", error);
      }
    };

    loadData();
  }, []);

  // Flash sale clock countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 45, seconds: 30 }; // resets countdown
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- BUSINESS ACTION HANDLERS (BLL INVOCATIONS) ---

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceFilter(5000000);
    setSizeFilter('all');
    setSwitchFilter('all');
    setConnectivityFilter('all');
    setTagFilter('all');
    setSortBy('featured');
  };

  // Compute number of active filters
  const activeFiltersCount = [
    searchQuery !== '',
    selectedCategory !== 'all',
    priceFilter < 5000000,
    sizeFilter !== 'all',
    switchFilter !== 'all',
    connectivityFilter !== 'all',
    tagFilter !== 'all'
  ].filter(Boolean).length;

  // Multi-condition products filtered list
  const filteredProducts = ProductFilterService.filterAndSort(products, {
    searchQuery,
    categoryId: selectedCategory,
    priceFilter,
    sizeFilter,
    switchFilter,
    connectivityFilter,
    tagFilter,
    sortBy
  });

  // Navigate to detailed single Product Page
  const handleProductClick = async (productId) => {
    setSelectedProductId(productId);
    setView('product');
    setQuantity(1);
    setDetailTab('specs');

    const pr = products.find(p => p.id === productId);
    if (pr) {
      setConfigSwitch(pr.switchType.includes('Linear') ? 'Linear (Êm Ái, Trơn Tru)' : 'Tactile (Khấc Cản, Đầm Tay)');
      setConfigColorway('Obsidian Black');
    }

    try {
      await ProductRepository.incrementViewCount(productId);
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, viewCount: (p.viewCount || 0) + 1 } 
            : p
        )
      );
    } catch (err) {
      console.error("Failed to increment product view count:", err);
    }

    // Scroll up
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to detailed Article guide
  const handleArticleClick = (articleId) => {
    setSelectedArticleId(articleId);
    setView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sign In submit handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      // Validate credentials using BLL
      const member = await AuthService.login(loginUsername, loginPassword);
      
      // Save session in DAL
      SessionRepository.saveSession(member);
      setCurrentUser(member);
      setCommentUser(member.name);

      // Auto-apply VIP discounts if role permits
      if (member.role.includes('VIP')) {
        const vipPromo = promotions.find(p => p.id === 'VIPMEM');
        if (vipPromo) {
          setAppliedCoupon(vipPromo);
        }
      }

      // Merge guest cart with user cart in backend
      try {
        const mergedCart = await CartRepository.mergeCart(sessionId, member.username);
        setCart(mergedCart);
      } catch (mergeErr) {
        console.error("Cart merge failed:", mergeErr);
        // Fallback: load user's cart from API
        const userCart = await CartRepository.getCart(member.username, null);
        setCart(userCart);
      }

      // Close login modal
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // Sign Out handler
  const handleLogout = async () => {
    SessionRepository.clearSession();
    setCurrentUser(null);
    setCommentUser('');
    setAppliedCoupon(null);
    setCouponInput('');
    setView('home');
    try {
      const guestCart = await CartRepository.getCart(null, sessionId);
      setCart(guestCart);
    } catch (err) {
      setCart([]);
    }
  };

  // Add keys to cart with stock validation using backend database API
  const handleAddToCart = async (product, qty = 1, silent = false) => {
    try {
      // Validate stock bounds using BLL rules
      CartService.validateAddToCart(product, configSwitch, configColorway, qty, cart);
      
      const username = currentUser?.username || null;
      const dbCart = await CartRepository.addToCart(
        username,
        sessionId,
        product.id,
        configSwitch,
        configColorway,
        qty
      );
      setCart(dbCart);
      
      if (!silent) {
        setShowCartModal(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Simulated billing calculator
  const bill = CartService.calculateBill(cart, appliedCoupon);

  // Apply promotional code
  const handleApplyCoupon = () => {
    setCouponError('');
    try {
      const coupon = CartService.verifyCoupon(couponInput, bill.subtotal, promotions);
      setAppliedCoupon(coupon);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message);
    }
  };

  // Remove promotional code
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Confirm shipping checkout and reduce stock levels
  const handleCheckoutSubmit = async (method) => {
    setCheckoutError('');
    try {
      // Validate shipping fields using BLL
      CheckoutService.validateShipping(shippingName, shippingPhone, shippingAddress);
      
      if (cart.length === 0) {
        throw new Error('Giỏ hàng đang trống!');
      }

      if (method === 'MoMo') {
        setShowMomoModal(true);
      } else {
        await executeOrderPlacement('COD', 'Pending');
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  const executeOrderPlacement = async (method, paymentStatus) => {
    setCheckoutError('');
    try {
      const username = currentUser?.username || null;
      const { invoice, updatedProducts } = await CheckoutService.processOrder(
        cart,
        appliedCoupon,
        {
          name: shippingName,
          phone: shippingPhone,
          address: shippingAddress,
          note: shippingNote
        },
        username,
        sessionId,
        method,
        paymentStatus
      );

      // Success branch: update components state
      setProducts(updatedProducts);
      setActiveInvoice(invoice);
      
      // Clear forms
      setCart([]);
      setShippingName('');
      setShippingPhone('');
      setShippingAddress('');
      setShippingNote('');
      setAppliedCoupon(null);
      setShowCartModal(false);
      setShowMomoModal(false);
    } catch (err) {
      setCheckoutError(err.message);
      throw err;
    }
  };

  const handleMomoPaymentSuccess = async (transferDesc) => {
    try {
      await executeOrderPlacement('MoMo', 'Paid');
    } catch (err) {
      alert(err.message || 'Lỗi xử lý đặt hàng sau khi thanh toán');
    }
  };

  // Add user rating comment reviews
  const handleAddReviewComment = async (e) => {
    e.preventDefault();
    setCommentError('');
    try {
      // BLL processes review calculations and database save
      const updatedProducts = await ReviewService.submitReview(
        selectedProductId,
        commentUser,
        commentRating,
        commentContent
      );

      setProducts(updatedProducts);
      
      // Reset input form
      setCommentContent('');
      if (!currentUser) setCommentUser('');
      setCommentRating(5);
    } catch (err) {
      setCommentError(err.message);
    }
  };

  // Identify active detail structures
  const activeProduct = products.find(p => p.id === selectedProductId) || null;
  const activeArticle = articles.find(a => a.id === selectedArticleId) || null;

  // Find related products matching similar Layout/Category tags
  const relatedProducts = activeProduct 
    ? products.filter(p => p.id !== activeProduct.id && p.categoryId === activeProduct.categoryId).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-purple-600/30 selection:text-purple-300 font-sans">
      
      {/* 1. PRESENTATION NAVBAR (PL) */}
      <Navbar 
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        resetFilters={resetFilters}
        cart={cart}
        setShowCartModal={setShowCartModal}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-10">
        
        {/* --- VIEW SWITCHER ROUTING (PL) --- */}

        {view === 'home' && (
          <div className="space-y-10">
            {/* Landing hero banner */}
            <Hero 
              handleProductClick={handleProductClick}
              handleAddToCart={handleAddToCart}
              products={products}
            />

            {/* Countdown Flash Sale & Member Dashboard */}
            <Promotions 
              currentUser={currentUser}
              timeLeft={timeLeft}
              setShowLoginModal={setShowLoginModal}
            />

            {/* Top 10 Best Selling & Most Viewed Horizontal Paginated Sections */}
            <TopProductsHorizontal 
              handleProductClick={handleProductClick}
              handleAddToCart={handleAddToCart}
              categories={categories}
            />

            {/* Grid & Sidebar filters split section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Left Sidebar filter panel */}
              <div className="md:col-span-1">
                <ProductFilters 
                  tagFilter={tagFilter}
                  setTagFilter={setTagFilter}
                  sizeFilter={sizeFilter}
                  setSizeFilter={setSizeFilter}
                  switchFilter={switchFilter}
                  setSwitchFilter={setSwitchFilter}
                  priceFilter={priceFilter}
                  setPriceFilter={setPriceFilter}
                  connectivityFilter={connectivityFilter}
                  setConnectivityFilter={setConnectivityFilter}
                  activeFiltersCount={activeFiltersCount}
                  resetFilters={resetFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showMobileFilters={showMobileFilters}
                />
              </div>

              {/* Right content products grid */}
              <div className="md:col-span-3 space-y-6">
                
                {/* Category tab layouts & Sort row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
                  
                  {/* Layout Size Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-thin">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedCategory === 'all' 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                          : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Tất cả phím cơ
                    </button>
                    {categories.filter(cat => cat.id !== 'all').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat.id 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                            : 'bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Sorter Selector */}
                  <div className="flex items-center justify-end gap-2.5">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">Sắp xếp</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-9 px-3 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="featured">Đặc sắc nhất</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                      <option value="rating">Đánh giá tốt nhất</option>
                      <option value="sold">Bán chạy hàng đầu</option>
                    </select>
                  </div>

                </div>

                {/* Main Dynamic grid layout */}
                <ProductGrid 
                  filteredProducts={filteredProducts}
                  handleProductClick={handleProductClick}
                  handleAddToCart={handleAddToCart}
                  categories={categories}
                  resetFilters={resetFilters}
                />

              </div>

            </div>

            {/* --- EXPERT BLOG ARTICLES GRID --- */}
            <section className="pt-8 border-t border-slate-900 space-y-6 text-left">
              <div className="space-y-1">
                <h2 className="font-display font-black text-2xl tracking-tight text-slate-100">
                  Cẩm Nang Bàn Phím Cơ Custom
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Chia sẻ kinh nghiệm rã phím, lube switch, cân stabilizer cực chi tiết từ chuyên gia.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <article 
                    key={art.id}
                    onClick={() => handleArticleClick(art.id)}
                    className="group rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-purple-500/20 hover:bg-slate-900 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-950">
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <span>{art.category}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {art.readTime}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-purple-400 font-bold group-hover:text-purple-300 mt-2">
                        Đọc bài viết <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

          </div>
        )}

        {view === 'category-lazyload' && (
          <CategoryLazyLoad 
            categories={categories}
            handleProductClick={handleProductClick}
            handleAddToCart={handleAddToCart}
          />
        )}

        {view === 'product' && activeProduct && (
          <ProductDetail 
            activeProduct={activeProduct}
            categories={categories}
            setView={setView}
            setSelectedCategory={setSelectedCategory}
            configSwitch={configSwitch}
            setConfigSwitch={setConfigSwitch}
            configColorway={configColorway}
            setConfigColorway={setConfigColorway}
            quantity={quantity}
            setQuantity={setQuantity}
            detailTab={detailTab}
            setDetailTab={setDetailTab}
            commentUser={commentUser}
            setCommentUser={setCommentUser}
            commentRating={commentRating}
            setCommentRating={setCommentRating}
            commentContent={commentContent}
            setCommentContent={setCommentContent}
            commentError={commentError}
            handleAddComment={handleAddReviewComment}
            relatedProducts={relatedProducts}
            handleProductClick={handleProductClick}
            handleAddToCart={handleAddToCart}
            setShowCartModal={setShowCartModal}
            currentUser={currentUser}
            resetFilters={resetFilters}
          />
        )}

        {view === 'article' && activeArticle && (
          <ArticleDetail 
            activeArticle={activeArticle}
            setView={setView}
          />
        )}

        {view === 'orders' && (
          <OrderHistory 
            currentUser={currentUser}
            setView={setView}
          />
        )}

        {view === 'admin' && currentUser && currentUser.role === 'Quản trị viên' && (
          <AdminPanel 
            setView={setView}
          />
        )}

      </main>

      {/* --- FLOATING PRESENTATION OVERLAYS (PL) --- */}

      {/* Member Login Modal */}
      <LoginModal 
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginUsername={loginUsername}
        setLoginUsername={setLoginUsername}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        setLoginError={setLoginError}
        handleLogin={handleLoginSubmit}
      />

      {/* Side Shopping Cart Drawer */}
      <CartDrawer 
        showCartModal={showCartModal}
        setShowCartModal={setShowCartModal}
        cart={cart}
        setCart={setCart}
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        couponError={couponError}
        setCouponError={setCouponError}
        shippingName={shippingName}
        setShippingName={setShippingName}
        shippingPhone={shippingPhone}
        setShippingPhone={setShippingPhone}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        shippingNote={shippingNote}
        setShippingNote={setShippingNote}
        checkoutError={checkoutError}
        setCheckoutError={setCheckoutError}
        handleApplyCoupon={handleApplyCoupon}
        handleRemoveCoupon={handleRemoveCoupon}
        handleCheckout={handleCheckoutSubmit}
        bill={bill}
        currentUser={currentUser}
        sessionId={sessionId}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* simulated COD Checkout Success Receipt */}
      <InvoiceModal 
        invoice={activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />

      {/* MoMo E-Wallet payment simulation */}
      <PaymentSimModal 
        isOpen={showMomoModal}
        onClose={() => setShowMomoModal(false)}
        totalAmount={bill.total}
        onPaymentSuccess={handleMomoPaymentSuccess}
      />

      {/* Premium Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-16 text-xs text-slate-500 font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="space-y-3">
            <span className="font-display font-black text-sm tracking-tight text-slate-300">
              FORGE<span className="text-purple-500">KEYBOARDS</span>
            </span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Trang chế tác và cá nhân hóa bàn phím cơ Custom cao cấp hàng đầu Việt Nam. Chất lượng gõ hoàn mỹ, dịch vụ chăm sóc hoàn thiện.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-350 font-bold uppercase tracking-wider text-[10px]">Đặc quyền dịch vụ</h4>
            <ul className="space-y-1.5 text-slate-450">
              <li>• Miễn phí giao hàng toàn quốc</li>
              <li>• Kiểm tra hàng trước khi thanh toán</li>
              <li>• Hỗ trợ hotswap trọn đời phím</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-350 font-bold uppercase tracking-wider text-[10px]">Nhà phân phối</h4>
            <p className="text-slate-450 leading-relaxed">
              Chi nhánh Hà Nội: 123 Đường Láng, Đống Đa.<br />
              Chi nhánh TP.HCM: 456 Nguyễn Thị Minh Khai, Q.3.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-350 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Shield className="w-4 h-4 text-purple-500" /> Secure Payments
            </h4>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Mọi giao dịch thanh toán COD được đảm bảo an toàn tuyệt đối bởi ForgeKeyboards Protection.
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900/60 text-center text-slate-500 text-[10px] uppercase tracking-wider">
          © {new Date().getFullYear()} ForgeKeyboards Inc. All rights reserved. Designed for Premium Mechanical Keyboards.
        </div>
      </footer>

    </div>
  );
}
