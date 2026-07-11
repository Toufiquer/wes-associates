/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const pageContentSchema = new Schema(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['section', 'pages', 'assets', 'form', 'button', 'title', 'description', 'paragraph', 'sliders', 'tagSliders', 'logoSliders', 'gallery', 'gellery'],
    },
    heading: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, timestamps: false },
);

const pageBuilderSchema = new Schema(
  {
    pageName: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: [pageContentSchema], default: [] },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.PageBuilder || mongoose.model('PageBuilder', pageBuilderSchema);
