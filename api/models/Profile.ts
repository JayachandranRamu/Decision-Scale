import mongoose, { Schema, Document } from 'mongoose';

const FactorSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  weight: { type: Number, required: true, default: 1 },
});

const CategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  pros: [FactorSchema],
  cons: [FactorSchema],
});

const ProfileSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  categories: [CategorySchema],
  lastModified: { type: Number, required: true, default: Date.now },
  theme: { type: String, enum: ['default', 'job', 'food', 'life'], default: 'default' },
  starred: { type: Boolean, default: false },
});

export const ProfileModel = mongoose.model('Profile', ProfileSchema);



