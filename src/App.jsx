import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import CategorySection from './components/CategorySection.jsx';
import ProductSection from './components/ProductSection.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import CartPage from './components/CartPage.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderConfirmation from './components/OrderConfirmation.jsx';
import ArticleDetails from './components/ArticleDetails.jsx';
import CategoryPage from './components/CategoryPage.jsx';
import SalePage from './components/SalePage.jsx';
import AboutPage from './components/AboutPage.jsx';
import ContactPage from './components/ContactPage.jsx';
import FAQPage from './components/FAQPage.jsx';
import PaymentPage from './components/PaymentPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import AccountPage from './components/AccountPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import PromoBanners from './components/PromoBanners.jsx';
import ArticlesSection from './components/ArticlesSection.jsx';
import Newsletter from './components/Newsletter.jsx';
import AppDownload from './components/AppDownload.jsx';
import FeatureStrip from './components/FeatureStrip.jsx';
import PopularSearches from './components/PopularSearches.jsx';
import Footer from './components/Footer.jsx';
import { products } from './data/products.js';
import { categories } from './data/categories.js';
import { articles } from './data/content.js';

const getRouteFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('order')) {
    return { page: 'confirmation', productId: null, orderId: params.get('order') };
  }
  if (params.get('login') === '1') {
    return { page: 'login', productId: null, orderId: null };
  }
  if (params.get('account') === '1') {
    return { page: 'account', productId: null, orderId: null };
  }
  if (params.get('admin') === '1') {
    return { page: 'admin', productId: null, orderId: null };
  }
  if (params.get('sale') === '1') {
    return { page: 'sale', productId: null };
  }
  if (params.get('about') === '1') {
    return { page: 'about', productId: null };
  }
  if (params.get('contact') === '1') {
    return { page: 'contact', productId: null };
  }
  if (params.get('faq') === '1') {
    return { page: 'faq', productId: null };
  }
  if (params.get('payment') === '1') {
    return { page: 'payment', productId: null };
  }
  const articleId = Number(params.get('article'));
  if (Number.isInteger(articleId) && articles.some((article) => article.id === articleId)) {
    return { page: 'article', articleId, productId: null, orderId: null };
  }
  const categoryId = params.get('category');
  if (categoryId === 'all' || categories.some((category) => category.slug === categoryId)) {
    return { page: 'category', categoryId, productId: null, orderId: null };
  }
  if (params.get('checkout') === '1') {
    return { page: 'checkout', productId: null };
  }
  if (params.get('cart') === '1') {
    return { page: 'cart', productId: null };
  }
  const id = Number(params.get('product'));
  return Number.isSafeInteger(id) && id > 0
    ? { page: 'product', productId: id, orderId: null }
    : { page: 'shop', productId: null, orderId: null };
};

const loadCart = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem('organic-store-cart') || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter(([id, quantity]) =>
        Number.isSafeInteger(Number(id)) && Number(id) > 0 &&
        Number.isInteger(quantity) &&
        quantity > 0
      )
    );
  } catch {
    return {};
  }
};

const loadCurrentUser = () => {
  try {
    const token = window.localStorage.getItem('organic-store-token');
    const saved = window.localStorage.getItem('organic-store-user');
    if (!token || !saved) return null;
    const user = JSON.parse(saved);
    return user && typeof user === 'object' && user.name && user.email ? user : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [wishlist, setWishlist] = useState(() => new Set());
  const [query, setQuery] = useState('');
  const [route, setRoute] = useState(getRouteFromUrl);
  const [lastOrder, setLastOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(loadCurrentUser);
  const [catalog, setCatalog] = useState(products);

  useEffect(() => {
    if (route.page === 'admin') return undefined;
    let active = true;
    fetch('/api/products')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Catalog request failed (${response.status}).`);
        if (!Array.isArray(result.products)) throw new Error('The product service returned an invalid catalog.');
        return result.products;
      })
      .then((items) => {
        if (active) {
          setCatalog(items);
        }
      })
      .catch((error) => {
        if (active) console.error(`The backend catalog is unavailable; showing the built-in demo catalog. ${error.message}`);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (route.page !== 'product') return;
    try {
      const visitorId = window.localStorage.getItem('organic-store-visitor-id') || window.crypto.randomUUID();
      window.localStorage.setItem('organic-store-visitor-id', visitorId);
      fetch(`/api/products/${route.productId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      }).catch((error) => console.error('Could not record product view:', error));
    } catch (error) {
      console.error('Could not create product-view tracking ID:', error);
    }
  }, [route.page, route.productId]);

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('organic-store-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('organic-store-user', JSON.stringify(currentUser));
      return;
    }
    window.localStorage.removeItem('organic-store-user');
  }, [currentUser]);

  const cartCount = useMemo(() => Object.values(cart).reduce((sum, qty) => sum + qty, 0), [cart]);

  const navigateTo = (page, productId) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('cart');
    url.searchParams.delete('checkout');
    url.searchParams.delete('product');
    url.searchParams.delete('order');
    url.searchParams.delete('article');
    url.searchParams.delete('category');
    url.searchParams.delete('sale');
    url.searchParams.delete('about');
    url.searchParams.delete('contact');
    url.searchParams.delete('faq');
    url.searchParams.delete('payment');
    url.searchParams.delete('login');
    url.searchParams.delete('account');
    url.searchParams.delete('admin');
    if (page === 'cart') url.searchParams.set('cart', '1');
    if (page === 'checkout') url.searchParams.set('checkout', '1');
    if (page === 'product') url.searchParams.set('product', productId);
    if (page === 'article') url.searchParams.set('article', productId);
    if (page === 'category') url.searchParams.set('category', productId);
    if (page === 'sale') url.searchParams.set('sale', '1');
    if (page === 'about') url.searchParams.set('about', '1');
    if (page === 'contact') url.searchParams.set('contact', '1');
    if (page === 'faq') url.searchParams.set('faq', '1');
    if (page === 'login') url.searchParams.set('login', '1');
    if (page === 'account') url.searchParams.set('account', '1');
    window.history.pushState({ page, productId }, '', url);
    setRoute({
      page,
      productId: page === 'product' ? productId : null,
      articleId: page === 'article' ? productId : null,
      categoryId: page === 'category' ? productId : null,
      orderId: null,
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const addToCart = (id, qty) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + qty }));
    navigateTo('cart');
  };

  const changeCartQuantity = (id, quantity) => {
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: quantity };
    });
  };

  const placeOrder = async (customer, paymentMethod) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        paymentMethod,
        items: Object.entries(cart).map(([productId, quantity]) => ({
          productId: Number(productId),
          quantity,
        })),
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || `Could not place order (${response.status}).`);
    const orderId = result.order.trackingNumber;
    const total = result.order.subtotal;
    setLastOrder({ id: orderId, paymentMethod, total });
    setCart({});
    const url = new URL(window.location.href);
    url.searchParams.delete('cart');
    url.searchParams.delete('checkout');
    url.searchParams.delete('product');
    url.searchParams.set('order', orderId);
    window.history.pushState({ page: 'confirmation', orderId }, '', url);
    setRoute({ page: 'confirmation', productId: null, articleId: null, orderId });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const toggleWishlist = (id) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openProduct = (id) => {
    navigateTo('product', id);
  };

  const openArticle = (id) => {
    navigateTo('article', id);
  };

  const openCategory = (id) => {
    navigateTo('category', id);
  };

  const openSale = () => {
    navigateTo('sale');
  };

  const openAbout = () => {
    navigateTo('about');
  };

  const openContact = () => {
    navigateTo('contact');
  };

  const openFAQ = () => {
    navigateTo('faq');
  };

  const openLogin = () => {
    navigateTo('login');
  };

  const openAccount = () => {
    navigateTo('account');
  };

  const openHome = () => {
    if (route.page !== 'shop') {
      showShop();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAccount = (userData) => {
    const account = userData?.user;
    const safeName = account?.name?.trim() || 'Organic Customer';
    const safeEmail = account?.email?.trim() || '';
    const nextUser = {
      name: safeName,
      email: safeEmail,
    };
    if (userData?.token) window.localStorage.setItem('organic-store-token', userData.token);
    setCurrentUser(nextUser);
    navigateTo('shop');
  };

  const handleLogin = (userData) => {
    const email = (userData?.user?.email || '').trim().toLowerCase();
    if (userData?.token) window.localStorage.setItem('organic-store-token', userData.token);
    setCurrentUser(userData?.user || {
      name: email ? email.split('@')[0] : 'Organic Customer',
      email,
    });
    navigateTo('shop');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem('organic-store-token');
    navigateTo('login');
  };

  const showShop = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    url.searchParams.delete('cart');
    url.searchParams.delete('checkout');
    url.searchParams.delete('order');
    url.searchParams.delete('article');
    url.searchParams.delete('category');
    url.searchParams.delete('sale');
    url.searchParams.delete('about');
    url.searchParams.delete('contact');
    url.searchParams.delete('faq');
    url.searchParams.delete('payment');
    url.searchParams.delete('login');
    url.searchParams.delete('account');
    url.searchParams.delete('admin');
    window.history.pushState({ page: 'shop' }, '', url);
    setRoute({ page: 'shop', productId: null, articleId: null, orderId: null });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const filter = (list) => {
    const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
    return q
      ? list.filter((p) => p.name.toLowerCase().replace(/\s+/g, ' ').includes(q))
      : list;
  };
  const arrived = filter(catalog.filter((product) => product.id <= 18 || product.id > 30));
  const selling = filter(catalog.filter((product) => product.id >= 25 && product.id <= 30));
  const onSale = filter(catalog.filter((product) => product.id >= 19 && product.id <= 24));
  const nothingFound = query.trim() && !arrived.length && !selling.length && !onSale.length;

  const shop = { addToCart, toggleWishlist, wishlist };
  const selectedProduct = catalog.find((product) => product.id === route.productId);

  if (route.page === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.size}
        query={query}
        onSearch={setQuery}
        onSearchSubmit={showShop}
        onCartOpen={() => navigateTo('cart')}
        currentUser={currentUser}
        onAccountOpen={openLogin}
        onCreateAccountOpen={openAccount}
        onLogout={handleLogout}
        onSaleOpen={openSale}
        onAboutOpen={openAbout}
        onContactOpen={openContact}
        onHomeOpen={openHome}
        activePage={
          route.page === 'shop' ? 'Home'
            : route.page === 'sale' ? 'Sale'
              : route.page === 'about' ? 'About'
                : route.page === 'contact' ? 'Contact' : null
        }
      />
      <main id="top">
        {route.page === 'login' ? (
          <LoginPage
            onBackToShop={showShop}
            onCreateAccount={() => navigateTo('account')}
            onLogin={handleLogin}
          />
        ) : route.page === 'account' ? (
          <AccountPage
            onBackToShop={showShop}
            onSignIn={() => navigateTo('login')}
            onCreateAccount={handleCreateAccount}
          />
        ) : route.page === 'cart' ? (
          <CartPage
            products={catalog}
            cart={cart}
            onQuantityChange={changeCartQuantity}
            onContinueShopping={showShop}
            onProductOpen={openProduct}
            onCheckout={() => navigateTo('checkout')}
          />
        ) : route.page === 'sale' ? (
          <SalePage
            products={catalog.filter((product) => product.id >= 19 && product.id <= 24)}
            shop={shop}
            onProductOpen={openProduct}
          />
        ) : route.page === 'about' ? (
          <AboutPage onShop={showShop} onCategoryOpen={openCategory} onArticleOpen={openArticle} />
        ) : route.page === 'contact' ? (
          <ContactPage />
        ) : route.page === 'faq' ? (
          <FAQPage onBack={showShop} />
        ) : route.page === 'payment' ? (
          <PaymentPage
            onCheckout={() => navigateTo('checkout')}
            onContact={openContact}
            onShop={showShop}
          />
        ) : route.page === 'checkout' ? (
          <CheckoutPage
            products={catalog}
            cart={cart}
            onBackToCart={() => navigateTo('cart')}
            onPlaceOrder={placeOrder}
          />
        ) : route.page === 'confirmation' ? (
          <OrderConfirmation
            order={lastOrder?.id === route.orderId ? lastOrder : { id: route.orderId }}
            onContinueShopping={showShop}
          />
        ) : route.page === 'category' ? (
          <CategoryPage
            categoryId={route.categoryId}
            products={catalog}
            shop={shop}
            onBack={showShop}
            onCategoryOpen={openCategory}
            onProductOpen={openProduct}
          />
        ) : route.page === 'article' ? (
          <ArticleDetails
            article={articles.find((article) => article.id === route.articleId)}
            onBack={showShop}
          />
        ) : selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            products={catalog}
            shop={shop}
            onBack={showShop}
            onProductOpen={openProduct}
          />
        ) : (
          <>
            <HeroSection />
            <CategorySection onCategoryOpen={openCategory} />
            {nothingFound ? (
              <p className="container no-results" role="status">
                No products match “{query}”. <button type="button" onClick={() => setQuery('')}>Clear search</button>
              </p>
            ) : null}
            {arrived.length > 0 && (
              <ProductSection
                id="freshly-arrived"
                title="Freshly arrived"
                products={arrived}
                variant="arrived"
                viewAllHref="#best-selling"
                defaultOpenId={arrived[0].id}
                shop={shop}
                onProductOpen={openProduct}
              />
            )}
            <PromoBanners />
            {selling.length > 0 && (
              <ProductSection
                id="best-selling"
                title="Best selling products"
                products={selling}
                variant="carousel"
                shop={shop}
                onProductOpen={openProduct}
              />
            )}
            {onSale.length > 0 && (
              <ProductSection
                id="products-on-sale"
                title="products on Sale"
                products={onSale}
                variant="carousel"
                shop={shop}
                onProductOpen={openProduct}
              />
            )}
            <ArticlesSection onArticleOpen={openArticle} />
            <Newsletter />
            <AppDownload />
            <FeatureStrip />
            <PopularSearches />
          </>
        )}
      </main>
      <Footer onHomeOpen={openHome} />
    </>
  );
}
