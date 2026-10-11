import 'dotenv/config';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createToken, requireAuth } from './auth.js';
import Counter from './models/Counter.js';
import Customer from './models/Customer.js';
import Order from './models/Order.js';
import Product from './models/Product.js';
import ProductView from './models/ProductView.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
const uploadDirectory = fileURLToPath(new URL('../uploads/', import.meta.url));
const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!acceptedImageTypes.has(file.mimetype)) {
      const error = new Error('Choose a JPEG, PNG, WebP, or GIF image.');
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '64kb' }));
app.use('/uploads', express.static(uploadDirectory, { maxAge: '1y', immutable: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Please try again later.' },
});

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const numberId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getImageExtension = (buffer) => {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) return 'gif';
  return null;
};

const storeProductImage = async (file) => {
  const extension = getImageExtension(file.buffer);
  if (!extension) {
    const error = new Error('The uploaded file is not a supported image.');
    error.status = 400;
    throw error;
  }
  await mkdir(uploadDirectory, { recursive: true });
  const filename = `${randomBytes(16).toString('hex')}.${extension}`;
  await writeFile(path.join(uploadDirectory, filename), file.buffer, { flag: 'wx' });
  return `/uploads/${filename}`;
};

const publicCustomer = (customer) => ({
  id: customer.id || customer._id,
  name: customer.name,
  email: customer.email,
});

const safeAdminPasswordMatch = async (candidate) => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  const candidateBuffer = Buffer.from(candidate);
  const configuredBuffer = Buffer.from(configured);
  return candidateBuffer.length === configuredBuffer.length &&
    timingSafeEqual(candidateBuffer, configuredBuffer);
};

const allocateProductId = async () => {
  const max = await Product.findOne().sort({ id: -1 }).select('id').lean();
  const highest = max?.id || 0;
  await Counter.findOneAndUpdate(
    { _id: 'product' },
    { $max: { seq: highest } },
    { upsert: true },
  );
  const counter = await Counter.findOneAndUpdate(
    { _id: 'product' },
    { $inc: { seq: 1 } },
    { new: true },
  );
  return counter.seq;
};

app.get('/api/health', (_req, res) => {
  res.json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'database-unavailable' });
});

app.get('/api/products', asyncRoute(async (req, res) => {
  const query = { active: true };
  if (typeof req.query.category === 'string' && req.query.category.trim()) {
    query.category = req.query.category.trim();
  }
  if (typeof req.query.search === 'string' && req.query.search.trim()) {
    query.name = { $regex: escapeRegex(req.query.search.trim().slice(0, 100)), $options: 'i' };
  }
  const products = await Product.find(query).sort({ id: 1 }).lean();
  res.json({ products });
}));

app.get('/api/products/:id', asyncRoute(async (req, res) => {
  const id = numberId(req.params.id);
  const product = id ? await Product.findOne({ id, active: true }).lean() : null;
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ product });
}));

app.post('/api/products/:id/view', asyncRoute(async (req, res) => {
  const id = numberId(req.params.id);
  const visitorId = typeof req.body.visitorId === 'string' ? req.body.visitorId.trim() : '';
  if (!id || !visitorId || visitorId.length > 80) {
    return res.status(400).json({ message: 'A valid product and visitor ID are required.' });
  }
  const product = await Product.findOne({ id, active: true }).select('_id').lean();
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  try {
    await ProductView.create({ productId: id, visitorId });
    await Product.updateOne({ id }, { $inc: { views: 1 } });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  return res.status(202).json({ recorded: true });
}));

app.post('/api/auth/register', authLimiter, asyncRoute(async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 72) {
    return res.status(400).json({ message: 'Enter a name, valid email, and password between 8 and 72 characters.' });
  }
  if (await Customer.exists({ email })) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }
  const customer = await Customer.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });
  const user = publicCustomer(customer);
  return res.status(201).json({
    token: createToken({ sub: String(customer._id), role: 'customer', email }),
    user,
  });
}));

app.post('/api/auth/login', authLimiter, asyncRoute(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const customer = await Customer.findOne({ email }).select('+passwordHash');
  if (!customer || !customer.passwordHash || !await bcrypt.compare(password, customer.passwordHash)) {
    return res.status(401).json({ message: 'Email or password is incorrect.' });
  }
  return res.json({
    token: createToken({ sub: String(customer._id), role: 'customer', email }),
    user: publicCustomer(customer),
  });
}));

app.post('/api/admin/login', authLimiter, asyncRoute(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail || email !== adminEmail || !await safeAdminPasswordMatch(password)) {
    return res.status(401).json({ message: 'Admin email or password is incorrect.' });
  }
  return res.json({
    token: createToken({ sub: adminEmail, role: 'admin' }),
    user: { email: adminEmail, role: 'admin' },
  });
}));

app.post('/api/orders', asyncRoute(async (req, res) => {
  const { customer: details, items, paymentMethod } = req.body;
  const name = typeof details?.name === 'string' ? details.name.trim() : '';
  const email = typeof details?.email === 'string' ? details.email.trim().toLowerCase() : '';
  const phone = typeof details?.phone === 'string' ? details.phone.trim() : '';
  const address = typeof details?.address === 'string' ? details.address.trim() : '';
  const city = typeof details?.city === 'string' ? details.city.trim() : '';
  const postalCode = typeof details?.postalCode === 'string' ? details.postalCode.trim() : '';
  if (!name || !phone || !address || !city || !postalCode ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Array.isArray(items) || items.length < 1 || items.length > 50 ||
      !['cod', 'visa', 'mastercard', 'amex'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'The customer, delivery, payment, or order details are invalid.' });
  }

  const quantities = new Map();
  for (const item of items) {
    const id = numberId(item?.productId);
    const quantity = Number(item?.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return res.status(400).json({ message: 'Each order item needs a valid product and quantity.' });
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity);
  }

  const products = await Product.find({ id: { $in: [...quantities.keys()] }, active: true }).lean();
  if (products.length !== quantities.size) {
    return res.status(400).json({ message: 'One or more products are unavailable.' });
  }
  const orderItems = products.map((product) => ({
    productId: product.id,
    name: product.name,
    image: product.image,
    quantity: quantities.get(product.id),
    price: product.price,
  }));
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const customer = await Customer.findOneAndUpdate(
    { email },
    { $setOnInsert: { name, email } },
    { new: true, upsert: true, runValidators: true },
  );
  const reserved = [];
  for (const item of orderItems) {
    const product = await Product.findOneAndUpdate(
      { id: item.productId, active: true, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity, sold: item.quantity } },
      { new: true },
    );
    if (!product) {
      await Promise.all(reserved.map(({ productId, quantity }) =>
        Product.updateOne({ id: productId }, { $inc: { stock: quantity, sold: -quantity } }),
      ));
      return res.status(409).json({ message: 'An item in your cart does not have enough stock.' });
    }
    reserved.push({ productId: item.productId, quantity: item.quantity });
  }

  const trackingNumber = `OG-${randomBytes(16).toString('hex').toUpperCase()}`;
  let order;
  try {
    order = await Order.create({
      trackingNumber,
      customer: customer._id,
      customerName: name,
      email,
      phone,
      address,
      city,
      postalCode,
      items: orderItems,
      subtotal,
      paymentMethod,
      statusHistory: [{ status: 'pending' }],
    });
  } catch (error) {
    await Promise.all(reserved.map(({ productId, quantity }) =>
      Product.updateOne({ id: productId }, { $inc: { stock: quantity, sold: -quantity } }),
    ));
    throw error;
  }
  return res.status(201).json({
    order: {
      id: order._id,
      trackingNumber: order.trackingNumber,
      subtotal: order.subtotal,
      status: order.status,
    },
  });
}));

app.get('/api/orders/track/:trackingNumber', asyncRoute(async (req, res) => {
  const order = await Order.findOne({ trackingNumber: req.params.trackingNumber.toUpperCase() })
    .select('trackingNumber customerName items subtotal status statusHistory createdAt updatedAt')
    .lean();
  if (!order) return res.status(404).json({ message: 'No order was found for that tracking number.' });
  return res.json({ order });
}));

app.get('/api/admin/overview', requireAuth('admin'), asyncRoute(async (_req, res) => {
  const [customers, products, orders, sales, topProducts] = await Promise.all([
    Customer.countDocuments(),
    Product.countDocuments({ active: true }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$subtotal' } } }]),
    Product.find({ active: true }).sort({ sold: -1, views: -1 }).limit(8)
      .select('id name image stock sold views').lean(),
  ]);
  return res.json({
    metrics: { customers, products, orders, sales: sales[0]?.total || 0 },
    topProducts,
  });
}));

app.get('/api/admin/products', requireAuth('admin'), asyncRoute(async (_req, res) => {
  const products = await Product.find().sort({ id: 1 }).lean();
  return res.json({ products });
}));

app.post('/api/admin/products', requireAuth('admin'), imageUpload.single('imageFile'), asyncRoute(async (req, res) => {
  const allowed = ['name', 'description', 'image', 'imgW', 'imgH', 'fit', 'price', 'oldPrice', 'discount', 'category', 'stock', 'active'];
  const fields = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const product = new Product({ ...fields, id: await allocateProductId() });
  await product.validate();
  if (req.file) product.image = await storeProductImage(req.file);
  await product.save();
  return res.status(201).json({ product });
}));

app.put('/api/admin/products/:id', requireAuth('admin'), imageUpload.single('imageFile'), asyncRoute(async (req, res) => {
  const id = numberId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid product ID.' });
  const allowed = ['name', 'description', 'image', 'imgW', 'imgH', 'fit', 'price', 'oldPrice', 'discount', 'category', 'stock', 'active'];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  if (!req.file) {
    const existingProduct = await Product.findOneAndUpdate({ id }, { $set: update }, {
      new: true,
      runValidators: true,
    });
    if (!existingProduct) return res.status(404).json({ message: 'Product not found.' });
    return res.json({ product: existingProduct });
  }
  const product = await Product.findOne({ id });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  product.set(update);
  await product.validate();
  if (req.file) product.image = await storeProductImage(req.file);
  await product.save();
  return res.json({ product });
}));

app.delete('/api/admin/products/:id', requireAuth('admin'), asyncRoute(async (req, res) => {
  const id = numberId(req.params.id);
  if (!id) return res.status(400).json({ message: 'Invalid product ID.' });
  const product = await Product.findOneAndUpdate({ id }, { $set: { active: false } }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  return res.json({ message: 'Product removed from the storefront.' });
}));

app.get('/api/admin/customers', requireAuth('admin'), asyncRoute(async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 })
    .select('name email createdAt').limit(200).lean();
  return res.json({ customers });
}));

app.get('/api/admin/orders', requireAuth('admin'), asyncRoute(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();
  return res.json({ orders });
}));

app.patch('/api/admin/orders/:id/status', requireAuth('admin'), asyncRoute(async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Choose a valid order status.' });
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  if (order.status === 'cancelled' && status !== 'cancelled') {
    return res.status(409).json({ message: 'Cancelled orders cannot be reopened.' });
  }
  if (order.status !== status) {
    if (status === 'cancelled') {
      await Promise.all(order.items.map((item) =>
        Product.updateOne({ id: item.productId }, { $inc: { stock: item.quantity, sold: -item.quantity } }),
      ));
    }
    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();
  }
  return res.json({ order });
}));

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({
      message: error.code === 'LIMIT_FILE_SIZE'
        ? 'Product images must be 5 MB or smaller.'
        : 'The image upload could not be processed.',
    });
  }
  if (error.status === 400) return res.status(400).json({ message: error.message });
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with those details already exists.' });
  }
  console.error('API request failed:', error);
  return res.status(500).json({ message: 'The server could not complete the request.' });
});

const start = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Copy .env.example to .env and configure MongoDB.');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.');
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error('Configure ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  app.listen(PORT, () => console.log(`Organic Store API listening on http://localhost:${PORT}`));
};

start().catch((error) => {
  console.error('Backend startup failed:', error.message);
  process.exitCode = 1;
});
