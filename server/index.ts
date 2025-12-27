import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { ProfileModel } from './models/Profile';

dotenv.config({ path: '.env.local' });
dotenv.config(); // Fallback to .env

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MongoURL || process.env.MONGODB_URI || 'mongodb://localhost:27017/decisionscale';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const maskedURI = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
console.log(`Connecting to MongoDB at: ${maskedURI}`);

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
// ... rest of routes ...

// Get all profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await ProfileModel.find().sort({ starred: -1, lastModified: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Create a new profile
app.post('/api/profiles', async (req, res) => {
  try {
    const newProfile = new ProfileModel(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create profile' });
  }
});

// Update a profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { id: id },
      req.body,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

// Delete a profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await ProfileModel.findOneAndDelete({ id: id });
    if (!deletedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

