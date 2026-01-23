const express = require('express');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const Land = require('./models/Land');
const Worker = require('./models/Worker');
const Job = require('./models/Job');
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');
require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'agri-smart-secret-key-change-this';

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = process.env.GOOGLE_MODEL_ID || 'gemini-pro';

if (!API_KEY) {
  console.error('Missing GOOGLE_API_KEY in server/.env.');
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ----------------------------------------------------------------------
// AUTHENTICATION ROUTES (Seperate Login & Info)
// ----------------------------------------------------------------------

// Register - Creates Auth + Profile separately
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, fullName, phone, address } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Auth User (Credentials only)
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });
    const savedUser = await newUser.save();

    // 4. Create User Profile (Personal Info only)
    const newProfile = new UserProfile({
      userId: savedUser._id,
      fullName: fullName || 'New User',
      phone,
      address
    });
    const savedProfile = await newProfile.save();

    // 5. Link Profile to User
    savedUser.profileId = savedProfile._id;
    await savedUser.save();

    res.status(201).json({
      success: true,
      userId: savedUser._id,
      message: 'User registered successfully with separate profile.'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login - Verifies Auth, Returns Token
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User by Email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // 3. Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // 4. Fetch Profile (to return basic info)
    const profile = await UserProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profileId: user.profileId
      },
      profile: profile // Sending profile separately as requested
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile (Separate Endpoint)
app.get('/api/user/profile/:userId', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Profile
app.patch('/api/user/profile/:userId', async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------
// DATA SEEDING (Optional - populates DB if empty)
// ----------------------------------------------------------------------
const seedData = async () => {
  try {
    const workerCount = await Worker.countDocuments();
    if (workerCount === 0) {
      console.log('Seeding initial Workers...');
      const workers = [
        {
          name: 'Ravi Kumar', phone: '+91 98765 43210', skills: ['Harvesting', 'Irrigation', 'Tractor Operation'],
          location: 'Sector 7, Village Road', distance: '2.5 km', rating: 4.8, available: true,
          experience: 8, completedJobs: 156, languages: ['Hindi', 'English', 'Punjabi'], hourlyRate: 80, verified: true
        },
        {
          name: 'Priya Devi', phone: '+91 98765 43211', skills: ['Sowing', 'Pest Control', 'Organic Farming'],
          location: 'North Fields, Plot 12', distance: '3.2 km', rating: 4.9, available: true,
          experience: 6, completedJobs: 98, languages: ['Hindi', 'English'], hourlyRate: 75, verified: true
        },
        {
          name: 'Mukesh Singh', phone: '+91 98765 43212', skills: ['Fertilizer Application', 'Crop Monitoring', 'Equipment Maintenance'],
          location: 'East Wing, Field C', distance: '4.1 km', rating: 4.7, available: false,
          experience: 12, completedJobs: 234, languages: ['Hindi', 'Haryanvi'], hourlyRate: 90, verified: true
        }
      ];
      await Worker.insertMany(workers);
    }

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('Seeding initial Jobs...');
      const jobs = [
        {
          title: 'Rice Harvesting - Urgent', description: 'Need experienced workers for rice harvesting.',
          farmOwner: 'Ramesh Patel', farmOwnerPhone: '+91 98765 54321', location: 'Sector 7, Village Road',
          distance: '2.3 km', workers: 5, date: '2024-01-15', time: '6:00 AM - 2:00 PM', duration: '8 hours',
          payment: '₹500/day', hourlyRate: 62, skills: ['Harvesting', 'Manual Labor'], urgent: true, verified: true,
          rating: 4.8, status: 'active', requirements: ['Rice harvesting exp', 'Physical fitness'], benefits: ['Lunch provided']
        },
        {
          title: 'Cotton Sowing Operation', description: 'Looking for skilled workers for cotton sowing.',
          farmOwner: 'Priya Singh', farmOwnerPhone: '+91 98765 54322', location: 'North Fields, Plot 12',
          distance: '4.1 km', workers: 3, date: '2024-01-18', time: '7:00 AM - 12:00 PM', duration: '5 hours',
          payment: '₹400/day', hourlyRate: 80, skills: ['Sowing', 'Seed Treatment'], urgent: false, verified: true,
          rating: 4.9, status: 'active', requirements: ['Cotton sowing exp'], benefits: ['Training provided']
        }
      ];
      await Job.insertMany(jobs);
    }

    // --- SEED DEMO USERS ---
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial Demo Users...');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt); // Default password for all demo users

      const demoUsers = [
        { email: 'farmer@demo.com', role: 'farmer', name: 'Demo Farmer', phone: '9876543210' },
        { email: 'worker@demo.com', role: 'worker', name: 'Demo Worker', phone: '9876543211' },
        { email: 'buyer@demo.com', role: 'buyer', name: 'Demo Buyer', phone: '9876543212' },
        { email: 'renter@demo.com', role: 'renter', name: 'Demo Renter', phone: '9876543213' }
      ];

      for (const u of demoUsers) {
        // Create User
        const newUser = new User({
          email: u.email,
          password: hashedPassword,
          role: u.role
        });
        const savedUser = await newUser.save();

        // Create Profile
        const newProfile = new UserProfile({
          userId: savedUser._id,
          fullName: u.name,
          phone: u.phone,
          address: 'Demo Address, India',
          farmLocation: u.role === 'farmer' ? 'Demo Farm Location' : undefined,
          farmAreaAcres: u.role === 'farmer' ? 10 : undefined,
          currentCrops: u.role === 'farmer' ? ['Rice', 'Wheat'] : undefined,
          bio: 'This is a demo account.'
        });
        const savedProfile = await newProfile.save();

        // Link
        savedUser.profileId = savedProfile._id;
        await savedUser.save();

        // Seed Lands for Demo Farmer
        if (u.role === 'farmer') {
          const demoLands = [
            {
              userId: savedUser._id, // Ideally Land schema would have userId, but current schema doesn't seem to enforce it strictly or uses it differently. Wait, Land.js (Step 93) doesn't have userId! 
              // If Land.js doesnt have userId, how does the system know which land belongs to whom?
              // Let's check Land.js again.
              // Land.js (Step 93) DOES NOT have userId. 
              // This implies the current system is Single Tenant or Shared. 
              // BUT FarmOwnerDashboard.tsx calls api.getLands() which returns ALL lands.
              // This is a simplistic implementation. 
              // For the demo to work, I just need to create lands.
              name: 'Demo Rice Field',
              location: 'North Field',
              crop: 'Rice',
              acreage: 5.5,
              stage: 'growing',
              plantedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              expectedHarvest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              soilType: 'clay',
              irrigationType: 'flooding',
              status: 'growing',
              lastUpdated: new Date().toISOString(),
              notes: 'Demo land entry'
            },
            {
              // No userId in schema? That's a problem for a multi-user system, but for this specific request 
              // (make "My Land" show existing land), creating them here works.
              name: 'Demo Wheat Plot',
              location: 'South Field',
              crop: 'Wheat',
              acreage: 4.5,
              stage: 'sowing',
              plantedDate: new Date().toISOString(),
              expectedHarvest: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
              soilType: 'loam',
              irrigationType: 'sprinkler',
              status: 'sowing',
              lastUpdated: new Date().toISOString(),
              notes: 'Demo land entry 2'
            }
          ];

          // Check if model has userId? 
          // In step 90 summary, I saw "server/models/Land.js: landSchema ... userId: { type: mongoose.Schema.Types.ObjectId ... }"
          // But in Step 93 `view_file` output, I saw:
          // 3: const LandSchema = new mongoose.Schema({
          // 4:     name: { type: String, required: true },
          // ... NO userId ...

          // This is a DISCREPANCY.
          // My view_file (Step 93) is the TRUTH of what is on disk.
          // So currently Lands are global?
          // If so, `FarmOwnerDashboard` shows ALL lands.
          // Okay, I will proceed with just creating them.

          for (const land of demoLands) {
            const newLand = new Land(land);
            await newLand.save();
          }
        }
      }
      console.log('Demo Users seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};
// Run seed logic after connection (simple delay or event listener is better, but this works for simple script)
setTimeout(seedData, 3000);

// ----------------------------------------------------------------------
// API ROUTES FOR DATABASE (MongoDB)
// ----------------------------------------------------------------------

// --- LANDS ---
app.get('/api/lands', async (req, res) => {
  try {
    const lands = await Land.find().sort({ createdAt: -1 });
    // Transform _id to id for frontend compatibility
    const formattedLands = lands.map(l => ({ ...l.toObject(), id: l._id.toString() }));
    res.json(formattedLands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lands', async (req, res) => {
  try {
    const newLand = new Land(req.body);
    const savedLand = await newLand.save();
    res.status(201).json({ ...savedLand.toObject(), id: savedLand._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/lands/:id', async (req, res) => {
  try {
    const updatedLand = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updatedLand.toObject(), id: updatedLand._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/lands/:id', async (req, res) => {
  try {
    await Land.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- WORKERS ---
app.get('/api/workers', async (req, res) => {
  try {
    // Basic filtering
    const { available } = req.query;
    const query = {};
    if (available !== undefined) query.available = available === 'true';

    const workers = await Worker.find(query);
    const formattedWorkers = workers.map(w => ({ ...w.toObject(), id: w._id.toString() }));
    res.json(formattedWorkers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- JOBS ---
app.get('/api/jobs', async (req, res) => {
  try {
    const { urgent } = req.query;
    const query = { status: 'active' };
    if (urgent !== undefined) query.urgent = urgent === 'true';

    const jobs = await Job.find(query);
    const formattedJobs = jobs.map(j => ({ ...j.toObject(), id: j._id.toString() }));
    res.json(formattedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json({ ...savedJob.toObject(), id: savedJob._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/jobs/:id/apply', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.applicants.push({
      ...req.body,
      appliedAt: new Date(),
      status: 'pending'
    });

    await job.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- ANALYTICS ---
app.get('/api/analytics', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const completedJobs = await Job.countDocuments({ status: 'completed' });
    const totalWorkers = await Worker.countDocuments();

    res.json({
      totalJobs,
      activeJobs,
      completedJobs,
      totalWorkers,
      averageRating: 4.7, // Placeholder or calculate aggregation
      totalEarnings: 45000 // Placeholder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ----------------------------------------------------------------------
// AI & EMAIL ROUTES (Existing Logic)
// ----------------------------------------------------------------------

// Content filter
function isAgricultureOrDashboardRelated(text) {
  const lowerText = text.toLowerCase();
  const keywords = [
    'crop', 'farm', 'soil', 'fertilizer', 'irrigation', 'pest', 'harvest',
    'rice', 'wheat', 'cotton', 'weather', 'job', 'worker', 'dashboard',
    'yield', 'sowing', 'planting', 'seed', 'water', 'temperature'
  ];
  return keywords.some(k => lowerText.includes(k));
}

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, context, messages, locale } = req.body || {};
    let finalPrompt = '';

    if (prompt) finalPrompt = String(prompt);
    else if (Array.isArray(messages)) {
      finalPrompt = messages.map(m => (m.role ? `${m.role}: ${m.content || m.text} ` : m.text)).join('\n');
    } else if (context) {
      finalPrompt = `${context} \n${req.body.input || ''}`;
    }

    if (!isAgricultureOrDashboardRelated(finalPrompt)) {
      return res.json({ reply: "I can only answer agriculture related questions." });
    }

    const systemInstruction = `You are AgriSmart AI. Respond in ${(locale === 'ta' ? 'Tamil' : 'English')}. Provide agricultural advice.`;
    const promptWithInstruction = `${systemInstruction}\n\n${finalPrompt}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptWithInstruction }] }]
      })
    });

    const json = await r.json();
    let reply = json.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no reply.';
    res.json({ reply });

  } catch (err) {
    console.error('AI Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/send-support-email', async (req, res) => {
  try {
    const { to, from, name, subject, message } = req.body;
    if (!to || !from || !message) return res.status(400).json({ error: 'Missing fields' });

    await transporter.sendMail({
      from: `"AgriSmart Support" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: from,
      subject: `Support: ${subject}`,
      text: `From: ${name} (${from})\n\n${message}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email Error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});


const port = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Backend server running on http://localhost:${port} with separate User & Profile DB`));
}

module.exports = app;
