import { useCallback, useEffect, useRef, useState } from 'react';

const emptyProduct = {
  name: '',
  description: '',
  image: '/images/product-01.webp',
  category: 'Groceries',
  price: '',
  oldPrice: '',
  stock: '0',
  discount: '',
};

async function request(path, options = {}, token = '') {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || `Request failed (${response.status}).`);
  return result;
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem('organic-store-admin-token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [busy, setBusy] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `API health check failed (${response.status}).`);
        if (result.status !== 'ok') throw new Error('MongoDB is not connected.');
        if (active) setApiStatus('ready');
      })
      .catch(() => {
        if (active) setApiStatus('unavailable');
      });
    return () => { active = false; };
  }, []);

  const loadDashboard = useCallback(async (authToken) => {
    setError('');
    try {
      const [overview, productResult, customerResult, orderResult] = await Promise.all([
        request('/api/admin/overview', {}, authToken),
        request('/api/admin/products', {}, authToken),
        request('/api/admin/customers', {}, authToken),
        request('/api/admin/orders', {}, authToken),
      ]);
      setMetrics(overview.metrics);
      setProducts(productResult.products);
      setCustomers(customerResult.customers);
      setOrders(orderResult.orders);
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.message.includes('session') || requestError.message.includes('Authentication')) {
        sessionStorage.removeItem('organic-store-admin-token');
        setToken('');
      }
    }
  }, []);

  useEffect(() => {
    if (token) loadDashboard(token);
  }, [token, loadDashboard]);

  const signIn = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await request('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      sessionStorage.setItem('organic-store-admin-token', result.token);
      setToken(result.token);
      setPassword('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setImageFile(null);
    setForm({
      name: product.name,
      description: product.description || '',
      image: product.image,
      category: product.category || 'Groceries',
      price: String(product.price),
      oldPrice: String(product.oldPrice || ''),
      stock: String(product.stock || 0),
      discount: product.discount || '',
    });
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Choose a JPEG, PNG, WebP, or GIF image.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Product images must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setError('');
    setImageFile(file);
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || 0,
      stock: Number(form.stock),
    };
    let body = JSON.stringify(payload);
    if (imageFile) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value)));
      formData.append('imageFile', imageFile);
      body = formData;
    }
    try {
      await request(
        editingId ? `/api/admin/products/${editingId}` : '/api/admin/products',
        { method: editingId ? 'PUT' : 'POST', body },
        token,
      );
      setForm(emptyProduct);
      setEditingId(null);
      clearSelectedImage();
      setNotice(editingId ? 'Product updated.' : 'Product added.');
      await loadDashboard(token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Remove "${product.name}" from the storefront?`)) return;
    setError('');
    setNotice('');
    try {
      await request(`/api/admin/products/${product.id}`, { method: 'DELETE' }, token);
      setNotice(`${product.name} removed from the storefront.`);
      await loadDashboard(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateOrder = async (orderId, status) => {
    setError('');
    try {
      await request(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }, token);
      await loadDashboard(token);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const signOut = () => {
    sessionStorage.removeItem('organic-store-admin-token');
    setToken('');
    setMetrics(null);
  };

  if (!token) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <img src="/images/logo-organic.svg" alt="Organic" />
          <p className="admin-eyebrow">Store management</p>
          <h1>Admin sign in</h1>
          <p>Sign in with the admin credentials configured for your backend.</p>
          {apiStatus === 'checking' && <p className="admin-api-status">Checking backend connection…</p>}
          {apiStatus === 'unavailable' && (
            <p className="admin-api-status admin-api-status--error" role="status">
              Backend unavailable. Start MongoDB and run <code>npm run server:dev</code> before signing in.
            </p>
          )}
          {apiStatus === 'ready' && <p className="admin-api-status admin-api-status--ready">Backend and MongoDB connected.</p>}
          <form onSubmit={signIn}>
            <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
            <button disabled={busy}>{busy ? 'Signing in…' : 'Sign in to admin'}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Organic store</p>
            <h1>Management dashboard</h1>
          </div>
          <div className="admin-header__actions">
            <button type="button" className="admin-button admin-button--light" onClick={() => loadDashboard(token)}>Refresh data</button>
            <button type="button" className="admin-button" onClick={signOut}>Sign out</button>
          </div>
        </header>

        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        {notice && <p className="admin-message admin-message--success" role="status">{notice}</p>}

        <section className="admin-metrics" aria-label="Store summary">
          {[
            ['Customers', metrics?.customers ?? '—'],
            ['Active products', metrics?.products ?? '—'],
            ['Orders', metrics?.orders ?? '—'],
            ['Sales recorded', metrics ? `$${metrics.sales.toFixed(2)}` : '—'],
          ].map(([label, value]) => (
            <article className="admin-metric" key={label}><span>{label}</span><strong>{value}</strong></article>
          ))}
        </section>

        <nav className="admin-tabs" aria-label="Dashboard sections">
          {[
            ['products', 'Products & inventory'],
            ['orders', 'Orders & tracking'],
            ['customers', 'Customers'],
          ].map(([key, label]) => (
            <button type="button" key={key} className={activeTab === key ? 'is-active' : ''} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </nav>

        {activeTab === 'products' && (
          <div className="admin-products">
            <form className="admin-card admin-product-form" onSubmit={saveProduct}>
              <h2>{editingId ? 'Edit product' : 'Add a product'}</h2>
              <label>Product name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength="120" /></label>
              <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="3" maxLength="2000" /></label>
              <div className="admin-image-upload">
                <label>Upload product image<input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={selectImage} /></label>
                <p>JPEG, PNG, WebP, or GIF, up to 5 MB. The image uploads when you save the product.</p>
                <img className="admin-image-preview" src={imagePreview || form.image} alt={imageFile ? 'Selected product image preview' : 'Current product image'} />
                {imageFile && <button type="button" className="admin-image-clear" onClick={clearSelectedImage}>Remove selected image</button>}
              </div>
              <label>Image path<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required /></label>
              <label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label>
              <div className="admin-form-row">
                <label>Price ($)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
                <label>Old price ($)<input type="number" min="0" step="0.01" value={form.oldPrice} onChange={(event) => setForm({ ...form, oldPrice: event.target.value })} /></label>
                <label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></label>
              </div>
              <label>Discount label<input value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} /></label>
              <div className="admin-form-actions">
                <button disabled={busy}>{editingId ? 'Save changes' : 'Add product'}</button>
                {editingId && <button type="button" className="admin-button admin-button--light" onClick={() => { setEditingId(null); setForm(emptyProduct); clearSelectedImage(); }}>Cancel edit</button>}
              </div>
            </form>

            <section className="admin-card admin-table-card">
              <div className="admin-section-heading"><h2>Inventory</h2><span>{products.length} products</span></div>
              <div className="admin-table-wrap">
                <table>
                  <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Views</th><th>Sold</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td><span className="admin-product-cell"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.category}</small></span></span></td>
                        <td>${product.price.toFixed(2)}</td>
                        <td><span className={product.stock < 5 ? 'admin-stock admin-stock--low' : 'admin-stock'}>{product.stock}</span></td>
                        <td>{product.views || 0}</td><td>{product.sold || 0}</td>
                        <td><div className="admin-row-actions"><button type="button" onClick={() => editProduct(product)}>Edit</button><button type="button" className="is-danger" onClick={() => removeProduct(product)}>Delete</button></div></td>
                      </tr>
                    ))}
                    {!products.length && <tr><td colSpan="6">No products found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'orders' && (
          <section className="admin-card admin-table-card">
            <div className="admin-section-heading"><h2>Orders and tracking</h2><span>Update order status to keep customers informed.</span></div>
            <div className="admin-table-wrap">
              <table>
                <thead><tr><th>Tracking number</th><th>Customer</th><th>Items</th><th>Total</th><th>Placed</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td><strong>{order.trackingNumber}</strong></td><td>{order.customerName}<small>{order.email}</small></td>
                      <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td>${order.subtotal.toFixed(2)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td><select value={order.status} onChange={(event) => updateOrder(order._id, event.target.value)}>{['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td>
                    </tr>
                  ))}
                  {!orders.length && <tr><td colSpan="6">No orders yet. Order tracking will appear here after checkout.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'customers' && (
          <section className="admin-card admin-table-card">
            <div className="admin-section-heading"><h2>Customers</h2><span>{customers.length} registered or checkout customers (latest 200)</span></div>
            <div className="admin-table-wrap">
              <table><thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
                <tbody>{customers.map((customer) => <tr key={customer._id}><td>{customer.name}</td><td>{customer.email}</td><td>{new Date(customer.createdAt).toLocaleDateString()}</td></tr>)}
                  {!customers.length && <tr><td colSpan="3">No customers yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
