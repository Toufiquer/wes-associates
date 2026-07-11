import mongoose, { Schema } from 'mongoose';

const licenseSchema = new Schema(
  {
    productId: { type: String, trim: true },
    productTitle: { type: String, trim: true },
    orderNo: { type: String, trim: true },
    licenseKey: { type: String, trim: true },
  },
  { _id: false },
);

const customerAccountSchema = new Schema(
  {
    name: { type: String, trim: true },
    mobileNumber: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    passwordHash: { type: String, select: false },
    passwordSalt: { type: String, select: false },
    photo: {
      url: { type: String },
      name: { type: String },
    },
    isBlocked: { type: Boolean, default: false },
    licenses: [licenseSchema],
  },
  { timestamps: true },
);

export default mongoose.models.CustomerAccount || mongoose.model('CustomerAccount', customerAccountSchema);
