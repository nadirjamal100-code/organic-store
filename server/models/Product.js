import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    image: { type: String, required: true, trim: true },
    imgW: { type: Number, default: 213 },
    imgH: { type: Number, default: 210 },
    fit: { type: String, enum: ['contain', 'cover'], default: 'contain' },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
    discount: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    category: { type: String, trim: true, default: 'General' },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('Product', productSchema);
