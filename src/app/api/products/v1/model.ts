import mongoose, { Schema } from 'mongoose';

const PRODUCT_MODEL_NAME = 'Products';

const imageSchema = new Schema(
  {
    url: { type: String },
    name: { type: String },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    category: [{ type: String, trim: true }],
    real_price: { type: Number, default: 0 },
    discount_price: { type: Number, default: 0 },
    description: { type: String, trim: true },
    features: [{ type: String }],
    star: { type: Number, default: 0 },
    view: { type: String },
    discount: { type: Number, default: 0 },
    primary_images: imageSchema,
    product_images: [imageSchema],
    status: { type: String, enum: ['active', 'hide', 'draft'], default: 'draft' },
    offerEnds: { type: Date },
    shareButtonsVisible: { type: Boolean, default: true },
    uploadProduct: imageSchema,
    liveUrl: { type: String },
    VideoUrl: { type: String },
  },
  { timestamps: true },
);

const existingProductModel = mongoose.models[PRODUCT_MODEL_NAME];

if (existingProductModel && !existingProductModel.schema.path('uploadProduct')) {
  mongoose.deleteModel(PRODUCT_MODEL_NAME);
}

export default mongoose.models[PRODUCT_MODEL_NAME] || mongoose.model(PRODUCT_MODEL_NAME, productSchema);
