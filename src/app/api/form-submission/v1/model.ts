/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const formSubmissionSchema = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);
