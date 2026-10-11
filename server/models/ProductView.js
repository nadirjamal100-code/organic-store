import mongoose from 'mongoose';

const productViewSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, index: true },
    visitorId: { type: String, required: true, maxlength: 80 },
    viewedAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false },
);

productViewSchema.index({ productId: 1, visitorId: 1 }, { unique: true });

export default mongoose.model('ProductView', productViewSchema);
