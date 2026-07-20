import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema(
  {
    kind: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    key: { type: String, default: '', trim: true },
    type: { type: String, default: '', trim: true },
    size: { type: Number, default: 0 },
  },
  { _id: false },
);

const applicationSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    fullName: { type: String, required: true, trim: true },
    mobileWhatsApp: { type: String, required: true, trim: true },
    age: { type: Number, min: 1, max: 120 },
    fatherName: { type: String, default: '', trim: true },
    motherName: { type: String, default: '', trim: true },
    englishProficiency: { type: String, default: '', trim: true },
    englishScore: { type: String, default: '', trim: true },
    otherCurriculum: { type: String, default: '', trim: true },
    selectedCountry: { type: String, default: '', trim: true },
    selectedCity: { type: String, default: '', trim: true },
    selectedUniversity: { type: String, default: '', trim: true },
    selectedCourseName: { type: String, default: '', trim: true },
    selectedCourseSubject: { type: String, default: '', trim: true },
    documents: { type: [documentSchema], default: [] },
    status: { type: String, enum: ['submitted', 'in_review', 'approved', 'rejected'], default: 'submitted', index: true },
    adminNote: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.StudentApplication || mongoose.model('StudentApplication', applicationSchema);
