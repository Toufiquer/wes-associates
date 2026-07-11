/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose from 'mongoose';

const MEDIA_MODEL_NAME = 'Media';

const mediaSchema = new mongoose.Schema(
  {
    delete_url: {
      type: String,
      trim: true,
    },
    display_url: {
      type: String,
      trim: true,
    },
    uploaderPlace: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    author_email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'trash'],
      default: 'active',
    },
    contentType: {
      type: String,
      enum: ['video', 'image', 'pdf', 'docx', 'audio', 'zip'],
      default: 'image',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const existingMediaModel = mongoose.models[MEDIA_MODEL_NAME];
const existingContentTypePath = existingMediaModel?.schema.path('contentType') as { enumValues?: string[] } | undefined;

if (existingContentTypePath && !existingContentTypePath.enumValues?.includes('zip')) {
  mongoose.deleteModel(MEDIA_MODEL_NAME);
}

export default mongoose.models[MEDIA_MODEL_NAME] || mongoose.model(MEDIA_MODEL_NAME, mediaSchema);
