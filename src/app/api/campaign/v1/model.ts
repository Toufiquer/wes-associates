import mongoose, { Schema } from 'mongoose';

const campaignSchema = new Schema(
  {
    campaignId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    totalImpressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'paused', 'completed', 'draft'], default: 'active' },
    note: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
