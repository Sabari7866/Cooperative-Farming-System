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
const Order = require('./models/Order');
const AgroShop = require('./models/AgroShop');
const Notification = require('./models/Notification'); // Added Notification model
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

// Admin: Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().populate('profileId');
    // Flatten structure for frontend convenience if needed, or send as is
    const formattedUsers = users.map(user => {
      const profile = user.profileId || {};
      return {
        id: user._id,
        email: user.email,
        role: user.role,
        name: profile.fullName || 'Unknown',
        phone: profile.phone || '',
        location: profile.address || '',
        joinedDate: user.createdAt,
        status: 'online', // Mock status for now, or implement socket.io later
        lastActive: 'Just now' // Mock
      };
    });
    res.json(formattedUsers);
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
          name: 'Ravi Kumar', phone: '+91 98765 43210', gender: 'Male', skills: ['Harvesting', 'Irrigation', 'Tractor Operation'],
          location: 'Sector 7, Village Road', distance: '2.5 km', rating: 4.8, available: true,
          experience: 8, completedJobs: 156, languages: ['Hindi', 'English', 'Punjabi'], hourlyRate: 80, verified: true
        },
        {
          name: 'Priya Devi', phone: '+91 98765 43211', gender: 'Female', skills: ['Sowing', 'Pest Control', 'Organic Farming'],
          location: 'North Fields, Plot 12', distance: '3.2 km', rating: 4.9, available: true,
          experience: 6, completedJobs: 98, languages: ['Hindi', 'English'], hourlyRate: 75, verified: true
        },
        {
          name: 'Mukesh Singh', phone: '+91 98765 43212', gender: 'Male', skills: ['Fertilizer Application', 'Crop Monitoring', 'Equipment Maintenance'],
          location: 'East Wing, Field C', distance: '4.1 km', rating: 4.7, available: false,
          experience: 12, completedJobs: 234, languages: ['Hindi', 'Haryanvi'], hourlyRate: 90, verified: true
        },
        {
          name: 'Anita Sharma', phone: '+91 98765 43213', gender: 'Female', skills: ['Harvesting', 'Quality Control', 'Post Harvest'],
          location: 'South Block, Field A', distance: '1.8 km', rating: 4.9, available: true,
          experience: 5, completedJobs: 87, languages: ['Hindi', 'English'], hourlyRate: 70, verified: true
        },
        {
          name: 'Suresh Patel', phone: '+91 98765 43214', gender: 'Male', skills: ['Equipment Operation', 'Land Preparation', 'Irrigation Systems'],
          location: 'West Valley, Plot 8', distance: '3.8 km', rating: 4.6, available: true,
          experience: 15, completedJobs: 312, languages: ['Hindi', 'Gujarati'], hourlyRate: 95, verified: true
        },
        {
          name: 'Meera Singh', phone: '+91 98765 43215', gender: 'Female', skills: ['Organic Farming', 'Seed Treatment', 'Composting'],
          location: 'Green Valley, Sector 3', distance: '2.1 km', rating: 4.8, available: true,
          experience: 7, completedJobs: 143, languages: ['Hindi', 'English'], hourlyRate: 85, verified: true
        },
        {
          name: 'Rajesh Yadav', phone: '+91 98765 43216', gender: 'Male', skills: ['Cotton Harvesting', 'Weed Control', 'Spraying'],
          location: 'Cotton Fields, Zone B', distance: '5.2 km', rating: 4.5, available: true,
          experience: 10, completedJobs: 178, languages: ['Hindi', 'Bhojpuri'], hourlyRate: 75, verified: true
        },
        {
          name: 'Lakshmi Naidu', phone: '+91 98765 43217', gender: 'Female', skills: ['Rice Cultivation', 'Transplanting', 'Manual Harvesting'],
          location: 'Paddy Fields, East', distance: '2.9 km', rating: 4.7, available: true,
          experience: 9, completedJobs: 201, languages: ['Hindi', 'Telugu', 'English'], hourlyRate: 80, verified: true
        },
        {
          name: 'Deepak Thakur', phone: '+91 98765 43218', gender: 'Male', skills: ['Tractor Operation', 'Land Leveling', 'Heavy Equipment'],
          location: 'Farm Equipment Zone', distance: '3.5 km', rating: 4.9, available: false,
          experience: 14, completedJobs: 289, languages: ['Hindi', 'Punjabi'], hourlyRate: 100, verified: true
        },
        {
          name: 'Sunita Kumari', phone: '+91 98765 43219', gender: 'Female', skills: ['Vegetable Farming', 'Greenhouse', 'Drip Irrigation'],
          location: 'Greenhouse Complex, Zone A', distance: '1.5 km', rating: 4.8, available: true,
          experience: 6, completedJobs: 112, languages: ['Hindi', 'English'], hourlyRate: 85, verified: true
        },
        {
          name: 'Manoj Kumar', phone: '+91 98765 43220', gender: 'Male', skills: ['Pest Control', 'Spraying', 'Disease Management'],
          location: 'Agricultural Hub, Sector 9', distance: '4.5 km', rating: 4.6, available: true,
          experience: 11, completedJobs: 167, languages: ['Hindi', 'Marathi'], hourlyRate: 90, verified: true
        },
        {
          name: 'Kamala Devi', phone: '+91 98765 43221', gender: 'Female', skills: ['Seed Sorting', 'Quality Control', 'Grain Storage'],
          location: 'Storage Facility, Main Road', distance: '2.3 km', rating: 4.7, available: true,
          experience: 8, completedJobs: 134, languages: ['Hindi', 'Rajasthani'], hourlyRate: 70, verified: true
        },
        {
          name: 'Vishnu Prasad', phone: '+91 98765 43222', gender: 'Male', skills: ['Irrigation Management', 'Pump Operation', 'Water Harvesting'],
          location: 'Water Management Zone', distance: '3.0 km', rating: 4.8, available: false,
          experience: 13, completedJobs: 245, languages: ['Hindi', 'Kannada', 'English'], hourlyRate: 95, verified: true
        },
        {
          name: 'Geeta Rawat', phone: '+91 98765 43223', gender: 'Female', skills: ['Organic Composting', 'Vermicomposting', 'Bio-Fertilizers'],
          location: 'Organic Farm, Green Zone', distance: '1.9 km', rating: 4.9, available: true,
          experience: 5, completedJobs: 78, languages: ['Hindi', 'Garhwali'], hourlyRate: 75, verified: true
        },
        {
          name: 'Brijesh Tiwari', phone: '+91 98765 43224', gender: 'Male', skills: ['Sugarcane Farming', 'Harvesting', 'Loading Operation'],
          location: 'Sugarcane Belt, Zone C', distance: '5.8 km', rating: 4.5, available: true,
          experience: 16, completedJobs: 321, languages: ['Hindi', 'Awadhi'], hourlyRate: 85, verified: true
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

    // Seed Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Seeding initial Orders...');
      const orders = [
        {
          orderNumber: 'ORD001', productId: 'PROD001', productName: 'Organic Rice 25kg',
          buyerId: 'demo_buyer', buyerName: 'Anitha R', sellerId: 'demo_farmer', sellerName: 'Ravi Kumar',
          amount: 1250, quantity: '50 bags', status: 'delivered',
          orderDate: new Date('2026-01-28'), deliveryDate: '2026-02-02', trackingId: 'TRK123456'
        },
        {
          orderNumber: 'ORD002', productId: 'PROD002', productName: 'Fresh Vegetables',
          buyerId: 'demo_buyer2', buyerName: 'Deepa S', sellerId: 'demo_farmer', sellerName: 'Lakshmi Devi',
          amount: 450, quantity: '20 kg', status: 'pending',
          orderDate: new Date('2026-02-03'), deliveryDate: 'TBD', trackingId: 'TRK123457'
        },
        {
          orderNumber: 'ORD003', productId: 'PROD003', productName: 'Cotton Bales',
          buyerId: 'demo_buyer', buyerName: 'Anitha R', sellerId: 'demo_farmer', sellerName: 'Priya M',
          amount: 5600, quantity: '10 bales', status: 'shipped',
          orderDate: new Date('2026-02-01'), deliveryDate: '2026-02-05', trackingId: 'TRK123458'
        }
      ];
      await Order.insertMany(orders);
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
              userId: savedUser._id,
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

          for (const land of demoLands) {
            const newLand = new Land(land);
            await newLand.save();
          }
        }
      }
      console.log('Demo Users seeded successfully!');
    }

    // --- SEED AGRO SHOPS ---
    const agroShopCount = await AgroShop.countDocuments();
    if (agroShopCount === 0) {
      console.log('Seeding initial Agro Shops...');
      const agroShops = [
        {
          name: 'Green Valley Agro Store',
          location: 'Main Market, Sector 5',
          distance: '1.2 km',
          phone: '+91 98765 11111',
          email: 'greenvalley@agroshop.com',
          products: ['Seeds', 'Fertilizers', 'Tools', 'Pesticides'],
          productPrices: [
            { name: 'Urea', price: 266.50, unit: '50kg Bag' },
            { name: 'DAP', price: 1350.00, unit: '50kg Bag' },
            { name: 'Potash', price: 1700.00, unit: '50kg Bag' },
            { name: 'Hybrid Paddy Seeds', price: 450.00, unit: 'kg' }
          ],
          rating: 4.6,
          reviewCount: 127,
          open: true,
          openingHours: { open: '8:00 AM', close: '8:00 PM' },
          address: '123 Main Market Road, Sector 5, Agricultural Zone',
          verified: true,
          description: 'One-stop shop for all your farming needs. Quality products at affordable prices.'
        },
        {
          name: 'Farmers Hub',
          location: 'Agricultural Complex',
          distance: '2.8 km',
          phone: '+91 98765 22222',
          email: 'farmershub@agroshop.com',
          products: ['Pesticides', 'Organic Manure', 'Irrigation Equipment', 'Spray Pumps'],
          productPrices: [
            { name: 'Organic Manure', price: 350.00, unit: '25kg Bag' },
            { name: 'Neem Oil', price: 550.00, unit: '1 Liter' },
            { name: 'Spray Pump', price: 2100.00, unit: 'Piece' },
            { name: 'Drip Pipe', price: 12.00, unit: 'per Meter' }
          ],
          rating: 4.8,
          reviewCount: 203,
          open: true,
          openingHours: { open: '7:00 AM', close: '7:00 PM' },
          address: '45 Agricultural Complex, Near Mandi',
          verified: true,
          description: 'Specialized in organic farming products and irrigation solutions.'
        },
        {
          name: 'Krishi Kendra',
          location: 'Near Bus Stand',
          distance: '3.5 km',
          phone: '+91 98765 33333',
          email: 'krishikendra@agroshop.com',
          products: ['Seeds', 'Fertilizers', 'Farm Equipment', 'Bio-Pesticides'],
          productPrices: [
            { name: 'Urea (Govt Subsidized)', price: 242.00, unit: '50kg Bag' },
            { name: 'Zinc Sulphate', price: 850.00, unit: 'kg' },
            { name: 'Wheat Seeds', price: 380.00, unit: 'kg' },
            { name: 'Bio-Fertilizer', price: 150.00, unit: 'Liter' }
          ],
          rating: 4.5,
          reviewCount: 89,
          open: true,
          openingHours: { open: '9:00 AM', close: '6:00 PM' },
          address: '78 Main Road, Near Central Bus Stand',
          verified: true,
          description: 'Government approved Krishi Kendra with subsidized products.'
        },
        {
          name: 'Agri King Supplies',
          location: 'Industrial Area, Phase 2',
          distance: '4.2 km',
          phone: '+91 98765 44444',
          email: 'agriking@agroshop.com',
          products: ['Tractors Parts', 'Machinery', 'Spare Parts', 'Lubricants'],
          productPrices: [
            { name: 'Engine Oil', price: 1850.00, unit: '5 Liter' },
            { name: 'Tractor Tire', price: 32000.00, unit: 'Piece' },
            { name: 'Lube Oil', price: 250.00, unit: 'Liter' }
          ],
          rating: 4.7,
          reviewCount: 156,
          open: true,
          openingHours: { open: '8:00 AM', close: '7:00 PM' },
          address: '234 Industrial Area, Phase 2, East Zone',
          verified: true,
          description: 'Complete range of farm machinery and spare parts.'
        },
        {
          name: 'Organic Farm Solutions',
          location: 'Green Zone, Sector 12',
          distance: '2.1 km',
          phone: '+91 98765 55555',
          email: 'organicfarm@agroshop.com',
          products: ['Organic Seeds', 'Bio-Fertilizers', 'Compost', 'Vermicompost'],
          productPrices: [
            { name: 'Vermicompost', price: 220.00, unit: '25kg Bag' },
            { name: 'Bio-DAP', price: 1100.00, unit: '50kg Bag' },
            { name: 'Organic Pesticide', price: 420.00, unit: 'Liter' }
          ],
          rating: 4.9,
          reviewCount: 178,
          open: true,
          openingHours: { open: '7:30 AM', close: '6:30 PM' },
          address: '56 Green Zone, Sector 12, Eco Park Road',
          verified: true,
          description: '100% organic and eco-friendly farming products.'
        },
        {
          name: 'Seed World',
          location: 'Market Area, Block C',
          distance: '1.8 km',
          phone: '+91 98765 66666',
          email: 'seedworld@agroshop.com',
          products: ['Hybrid Seeds', 'Native Seeds', 'Vegetable Seeds', 'Flower Seeds'],
          productPrices: [
            { name: 'Hybrid Paddy', price: 420.00, unit: 'kg' },
            { name: 'Tomato Seeds', price: 85.00, unit: 'Packet' },
            { name: 'Chilli Seeds', price: 65.00, unit: 'Packet' }
          ],
          rating: 4.6,
          reviewCount: 234,
          open: true,
          openingHours: { open: '8:00 AM', close: '8:00 PM' },
          address: '89 Market Area, Block C, Near Post Office',
          verified: true,
          description: 'Largest collection of quality seeds for all seasons.'
        },
        {
          name: 'Farm Tools Center',
          location: 'Hardware Market',
          distance: '3.0 km',
          phone: '+91 98765 77777',
          email: 'farmtools@agroshop.com',
          products: ['Hand Tools', 'Power Tools', 'Sprayers', 'Protective Gear'],
          productPrices: [
            { name: 'Spade', price: 450.00, unit: 'Piece' },
            { name: 'Sickle', price: 180.00, unit: 'Piece' },
            { name: 'Gloves', price: 250.00, unit: 'Pair' }
          ],
          rating: 4.4,
          reviewCount: 98,
          open: true,
          openingHours: { open: '9:00 AM', close: '7:00 PM' },
          address: '12 Hardware Market, Tool Lane',
          verified: false,
          description: 'Quality farming tools and safety equipment.'
        },
        {
          name: 'Kisan Seva Kendra',
          location: 'Village Center',
          distance: '0.8 km',
          phone: '+91 98765 88888',
          email: 'kisanseva@agroshop.com',
          products: ['Fertilizers', 'Seeds', 'Soil Testing', 'Advisory Services'],
          productPrices: [
            { name: 'Urea', price: 266.00, unit: '50kg Bag' },
            { name: 'DAP', price: 1350.00, unit: '50kg Bag' },
            { name: 'Organic Seeds', price: 320.00, unit: 'kg' }
          ],
          rating: 4.7,
          reviewCount: 312,
          open: true,
          openingHours: { open: '6:00 AM', close: '9:00 PM' },
          address: '1 Village Center, Main Chowk',
          verified: true,
          description: 'Your local farming partner with advisory services.'
        }
      ];
      await AgroShop.insertMany(agroShops);
      console.log('Agro Shops seeded successfully!');
    }

    // Seed Lands
    const landCount = await Land.countDocuments();
    if (landCount === 0) {
      const lands = [
        {
          name: 'Green Valley Rice Field',
          location: 'Thanjavur, Tamil Nadu',
          crop: 'Rice',
          stage: 'Growing',
          acreage: 5.5,
          soilType: 'Clay Loam',
          irrigationType: 'Canal',
          ownerId: 'demo-farmer', // consistent with demo user if possible
          status: 'growing',
          notes: 'High yield expected this season.',
          images: []
        },
        {
          name: 'Sunshine Cotton Farm',
          location: 'Coimbatore, Tamil Nadu',
          crop: 'Cotton',
          stage: 'Sowing',
          acreage: 3.2,
          soilType: 'Black Soil',
          irrigationType: 'Drip',
          ownerId: 'demo-farmer',
          status: 'sowing',
          notes: 'New variety seeded.',
          images: []
        }
      ];
      await Land.insertMany(lands);
      console.log('Lands seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};
// Run seed logic after connection
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
    const { available, gender } = req.query;
    const query = {};
    if (available !== undefined) query.available = available === 'true';
    if (gender && gender !== 'all') query.gender = { $regex: new RegExp(`^${gender}$`, 'i') }; // Case-insensitive match

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

    const applicantData = req.body;
    job.applicants.push({
      workerId: applicantData.id || applicantData.workerId,
      workerName: applicantData.name || applicantData.workerName,
      workerPhone: applicantData.phone || applicantData.workerPhone,
      workerRating: applicantData.rating || applicantData.workerRating,
      message: applicantData.message,
      appliedAt: new Date(),
      status: 'pending'
    });

    await job.save();

    // Create Notification for Farm Owner
    try {
      await Notification.create({
        userId: job.farmOwner || 'unknown', // Use farmOwner ID or name
        message: `New application: ${applicantData.name || 'Worker'} applied for ${job.title}`,
        type: 'info',
        relatedId: job._id.toString()
      });
    } catch (notifErr) {
      console.error('Notification creation failed:', notifErr);
      // Don't fail the request if notification fails
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Apply Job Error:', err);
    res.status(400).json({ error: err.message });
  }
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', async (req, res) => {
  try {
    // In a real app, filter by req.user.id. 
    // For now, return all or filter by query param 'userId' if provided
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    const formatted = notifications.map(n => ({ ...n.toObject(), id: n._id.toString() }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN DELETE ROUTES ---

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Attempt to delete profile if exists
    await Profile.findOneAndDelete({ userId: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/lands/:id', async (req, res) => {
  try {
    const land = await Land.findByIdAndDelete(req.params.id);
    if (!land) return res.status(404).json({ error: 'Land not found' });
    res.json({ message: 'Land deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const formattedOrders = orders.map(o => ({
      ...o.toObject(),
      id: o._id.toString(), // Ensure ID is string
      product: o.productName, // Map for frontend compatibility if needed
      buyer: o.buyerName,
      seller: o.sellerName
    }));
    res.json(formattedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- AGRO SHOPS ---
app.get('/api/agroshops', async (req, res) => {
  try {
    const { open, maxDistance } = req.query;
    const query = {};
    if (open !== undefined) query.open = open === 'true';

    const shops = await AgroShop.find(query).sort({ rating: -1 });
    const formattedShops = shops.map(s => ({ ...s.toObject(), id: s._id.toString() }));
    res.json(formattedShops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/agroshops/:id', async (req, res) => {
  try {
    const shop = await AgroShop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    res.json({ ...shop.toObject(), id: shop._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agroshops', async (req, res) => {
  try {
    const newShop = new AgroShop(req.body);
    const savedShop = await newShop.save();
    res.status(201).json({ ...savedShop.toObject(), id: savedShop._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/agroshops/:id', async (req, res) => {
  try {
    const updatedShop = await AgroShop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedShop) return res.status(404).json({ error: 'Shop not found' });
    res.json({ ...updatedShop.toObject(), id: updatedShop._id.toString() });
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
    const totalOrders = await Order.countDocuments();

    // Calculate Total Revenue (mock logic + real sum)
    const orders = await Order.find();
    const orderRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    res.json({
      totalJobs,
      activeJobs,
      completedJobs,
      totalWorkers,
      totalOrders,
      revenue: 2400000 + orderRevenue, // Adding base mock revenue + real order revenue
      averageRating: 4.7,
      totalEarnings: 45000
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

    // Enhanced system instruction for agricultural expertise
    const systemInstruction = `You are AgriSmart AI, an expert agricultural advisor with access to the latest farming information. 
Provide specific, actionable advice for farmers. Include:
- Specific measurements and quantities
- Timing and schedules
- Best practices and warnings
- Modern techniques and research-backed methods
Respond in ${(locale === 'ta' ? 'Tamil' : locale === 'hi' ? 'Hindi' : 'English')}.`;

    const enhancedPrompt = `${systemInstruction}\n\nQuestion: ${finalPrompt}\n\nProvide a detailed, practical answer with specific recommendations.`;

    // Try Gemini API first with web search grounding
    if (API_KEY && API_KEY !== 'AIza...your_google_api_key_here') {
      try {
        // Using Gemini 1.5 Flash with Google Search grounding for web-based answers
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const requestBody = {
          contents: [{
            parts: [{ text: enhancedPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          // Enable Google Search grounding for web-based information
          tools: [{
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: "MODE_DYNAMIC",
                dynamicThreshold: 0.3
              }
            }
          }]
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const json = await response.json();

        // Extract reply from Gemini API response
        let reply = '';

        if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
          reply = json.candidates[0].content.parts[0].text;

          // Add grounding metadata if available (sources from web search)
          if (json.candidates[0].groundingMetadata) {
            const sources = json.candidates[0].groundingMetadata.webSearchQueries || [];
            if (sources.length > 0) {
              reply += '\n\n📚 Sources: Web search enabled for latest information';
            }
          }
        } else if (json.error) {
          console.error('Gemini API Error:', json.error);
          throw new Error(json.error.message || 'AI Service Error');
        }

        if (reply && reply.trim() !== '') {
          return res.json({ reply, source: 'gemini-ai-web-search' });
        }
      } catch (apiError) {
        console.error('Gemini API request failed, using fallback:', apiError.message);
        // Continue to fallback
      }
    }

    // Fallback: Enhanced local knowledge base
    const fallbackReply = getEnhancedLocalResponse(finalPrompt, locale);
    res.json({
      reply: fallbackReply,
      source: 'local-knowledge-base',
      note: 'Configure GOOGLE_API_KEY in server/.env for AI-powered web search'
    });

  } catch (err) {
    console.error('AI Proxy Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Enhanced local fallback with comprehensive agricultural knowledge
function getEnhancedLocalResponse(question, locale = 'en') {
  const q = question.toLowerCase();

  // Crop-specific responses with web-quality information
  if (/rice|paddy/i.test(q)) {
    if (/disease|blast|blight/i.test(q)) {
      return `🌾 Rice Disease Management (Latest Best Practices):\n\n🔬 **Blast Disease:**\n- Chemical: Tricyclazole 75% WP @ 0.6g/L or Tebuconazole 50% + Trifloxystrobin 25% WG @ 0.4g/L\n- Timing: Spray at tillering, booting, and heading stages\n- Preventive measures: Use resistant varieties like Pusa Basmati 1121, maintain silicon balance\n\n🦠 **Bacterial Leaf Blight:**\n- Chemical: Copper oxychloride 50% WP @ 3g/L or Streptocycline @ 100ppm\n- Cultural: Destroy stubbles, avoid excess nitrogen\n\n🌿 **Sheath Blight:**\n- Chemical: Validamycin 3% L @ 2ml/L or Hexaconazole 5% EC @ 2ml/L\n- Apply near water level at maximum tillering stage\n\n✅ **Prevention Strategy:**\n- Balanced NPK (avoid excess N)\n- Proper spacing (20x15 cm)\n- Remove infected plants immediately\n- Seed treatment with Pseudomonas fluorescens`;
    }
    if (/fertilizer|npk/i.test(q)) {
      return `🌾 Rice Fertilizer Program (Research-Based):\n\n📊 **NPK Recommendation (per hectare):**\n- Nitrogen (N): 120 kg\n- Phosphorus (P₂O₅): 60 kg  \n- Potassium (K₂O): 40 kg\n- Zinc Sulphate: 25 kg (if deficient)\n\n⏰ **Application Schedule:**\n\n1️⃣ **Basal (Day 0):**\n- Full P & K\n- 50% of N\n= 130 kg DAP + 50 kg MOP + 50 kg Urea\n\n2️⃣ **First Top Dressing (25-30 DAS):**\n- 25% of N = 60 kg Urea\n\n3️⃣ **Second Top Dressing (PI stage, ~55 DAS):**\n- 25% of N = 60 kg Urea\n\n💡 **Tips:**\n- Apply with irrigation/rain\n- Use LCC (Leaf Color Chart) for precision\n- Add 10 tons FYM before puddling\n- For SRI method, reduce N by 25%`;
    }
  }

  if (/wheat/i.test(q) && /fertilizer/i.test(q)) {
    return `🌾 Wheat Fertilizer Schedule (Scientific Approach):\n\n📊 **Recommended Dose (per hectare):**\n- N: 120-150 kg\n- P₂O₅: 60 kg\n- K₂O: 40 kg\n- Sulphur: 30 kg (important!)\n\n⏰ **Application Stages:**\n\n🌱 **At Sowing:**\n- 260 kg DAP (provides all P + 46 kg N)\n- 67 kg MOP (provides all K)\n- 30 kg Urea (provides 14 kg N)\n- 150 kg Single Super Phosphate (if S deficient)\n\n🌿 **CRI Stage (20-25 days):**\n- 130 kg Urea with 1st irrigation\n\n🌾 **Late Jointing (40-45 days):**\n- 130 kg Urea with 2nd irrigation\n\n🎯 **Micronutrients:**\n- Zinc: 25 kg ZnSO₄ (in Zn-deficient soils)\n- Iron: Foliar spray if chlorosis appears\n\n💡 **Modern Approach:**\n- Use Neem-coated urea for better efficiency\n- Consider nano-fertilizers for 30% savings`;
  }

  if (/pest|disease/i.test(q)) {
    return `🐛 Integrated Pest Management (IPM) - Current Best Practices:\n\n👁️ **Monitoring:**\n- Install 8 pheromone traps/acre\n- Yellow sticky traps @ 15-20/acre\n- Scout fields 2x weekly\n- Use pest forecast apps\n\n🌿 **Preventive Measures:**\n- Crop rotation (cereal-legume-cereal)\n- Resistant varieties (check latest releases)\n- Optimum plant spacing\n- Balanced nutrition (avoid excess N)\n- Border crops (marigold for nematodes)\n\n🧪 **Biological Control:**\n- Trichogramma cards: 50,000/acre @ 7-day intervals\n- Chrysoperla: 10,000 larvae/acre\n- NPV (Nuclear Polyhedrosis Virus): 250 LE/acre\n- Beauveria bassiana: 2-2.5 kg/acre for soil pests\n\n🌱 **Organic Options:**\n- Neem oil 1500 ppm @ 5ml/L\n- Pongamia oil @ 10ml/L for sucking pests\n- NSKE (Neem Seed Kernel Extract) 5%\n\n⚗️ **Chemical Control (Last Resort):**\n- Rotate mechanism of action groups\n- Use recommended doses only\n- Follow PHI (Pre-Harvest Interval)\n- Use recommended safety equipment`;
  }

  // Default comprehensive response
  return `🌾 AgriSmart AI - Agricultural Advisor\n\nI can help with:\n\n✅ **Crop Management:** Rice, Wheat, Cotton, Maize, Pulses, Vegetables\n✅ **Soil Health:** Testing, amendments, pH management\n✅ **Nutrition:** NPK, micronutrients, organic fertilizers\n✅ **Pest & Disease:** IPM, biological control, chemical options\n✅ **Water Management:** Drip, sprinkler, scheduling\n✅ **Modern Technology:** Drones, sensors, precision farming\n\n💡 **Ask specific questions like:**\n- "Best fertilizer for wheat in clay soil?"\n- "How to control pink bollworm in cotton?"\n- "Drip irrigation setup cost for 5 acres?"\n- "Organic alternatives to chemical pesticides?"\n\n📱 For AI-powered web search with latest research, configure the API key in server/.env`;
}

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


const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Backend server running on http://localhost:${port} with separate User & Profile DB`));
}

module.exports = app;
