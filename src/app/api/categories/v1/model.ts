/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const childItemSchema = new Schema(
  {
    sl_no: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const categorySchema = new Schema(
  {
    sl_no: { type: Number, required: true },
    name: { type: String, required: true },
    children: [childItemSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
