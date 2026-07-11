import mongoose, { Schema } from 'mongoose';

const memberSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    realPrice: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    endDiscount: { type: Date },
    productIds: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export default mongoose.models.Member || mongoose.model('Member', memberSchema);
