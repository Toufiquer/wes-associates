import mongoose, { Schema } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: String },
    title: { type: String, trim: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNo: { type: String, trim: true, unique: true, sparse: true },
    customerName: { type: String, trim: true },
    customerEmail: {
      type: String,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    customerPhone: { type: String, trim: true },
    items: [orderItemSchema],
    subtotal: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, trim: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'], default: 'pending' },
    deliveryStatus: { type: String, enum: ['pending', 'packed', 'shipped', 'delivered', 'returned'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, trim: true },
    note: { type: String, trim: true },
    tranId: { type: String, trim: true, unique: true, sparse: true },
    valId: { type: String, trim: true },
    bankTranId: { type: String, trim: true },
    cardType: { type: String, trim: true },
    currency: { type: String, trim: true, default: 'BDT' },
    riskLevel: { type: String, trim: true },
    riskTitle: { type: String, trim: true },
    paymentGatewayData: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default mongoose.models.Orders || mongoose.model('Orders', orderSchema);
