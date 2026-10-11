import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import { products } from '../src/data/products.js';

const seed = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all(products.map((product) => Product.updateOne(
    { id: product.id },
    {
      $setOnInsert: {
        ...product,
        description: '',
        category: 'Groceries',
        stock: 25,
        sold: 0,
        views: 0,
        active: true,
      },
    },
    { upsert: true, runValidators: true },
  )));
  console.log(`Seeded ${products.length} storefront products.`);
};

seed()
  .catch((error) => {
    console.error('Product seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
