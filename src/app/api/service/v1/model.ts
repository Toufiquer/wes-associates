import mongoose, { Schema } from 'mongoose';

const degreeLevelSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    degreeLevel: { type: String, required: true, trim: true },
    tutionFees: { type: String, default: '', trim: true },
    duration: { type: String, default: '', trim: true },
  },
  { _id: false },
);

const courseSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    tutionFees: { type: String, default: '', trim: true },
    duration: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    scholarship: { type: String, default: '', trim: true },
    minimumRequirement: { type: String, default: '', trim: true },
    degreeLevelInfo: { type: [degreeLevelSchema], default: [] },
    applyBtnParms: { type: [String], default: [] },
    applyBtnParmsDegreeLevel: { type: [String], default: [] },
  },
  { _id: false },
);

const universitySchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '', trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    courses: { type: [courseSchema], default: [] },
  },
  { _id: false },
);

const serviceCountrySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    country: { type: String, required: true, unique: true, trim: true },
    city: { type: [String], default: [] },
    universitys: { type: [universitySchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.models.ServiceCountry || mongoose.model('ServiceCountry', serviceCountrySchema);
