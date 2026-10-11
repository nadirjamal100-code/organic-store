import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    trackingNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    items: [{
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    }],
    subtotal: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [{
      status: { type: String, required: true },
      changedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('Order', orderSchema);
