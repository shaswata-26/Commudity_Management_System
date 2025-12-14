import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data...');

    // Create demo users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        email: 'manager@example.com',
        password: hashedPassword,
        role: 'manager',
        name: 'John Manager',
      },
      {
        email: 'keeper@example.com',
        password: hashedPassword,
        role: 'store_keeper',
        name: 'Jane Storekeeper',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created demo users...');

    // Create sample products
    const sampleProducts = [
      {
        name: 'Wheat',
        category: 'agriculture',
        quantity: 1000,
        unit: 'kg',
        price: 0.25,
        location: 'Warehouse A',
        supplier: 'Farmers Co-op',
        createdBy: createdUsers[0]._id,
      },
      {
        name: 'Crude Oil',
        category: 'energy',
        quantity: 500,
        unit: 'barrel',
        price: 75.50,
        location: 'Storage Tank 3',
        supplier: 'Oil Corp',
        createdBy: createdUsers[0]._id,
      },
      {
        name: 'Copper',
        category: 'metals',
        quantity: 2000,
        unit: 'kg',
        price: 8.75,
        location: 'Metals Storage',
        supplier: 'Mining Inc',
        createdBy: createdUsers[1]._id,
      },
      {
        name: 'Live Cattle',
        category: 'livestock',
        quantity: 150,
        unit: 'unit',
        price: 1200,
        location: 'Farm Site B',
        supplier: 'Cattle Ranch',
        createdBy: createdUsers[0]._id,
      },
      {
        name: 'Coffee Beans',
        category: 'agriculture',
        quantity: 800,
        unit: 'kg',
        price: 4.20,
        location: 'Warehouse B',
        supplier: 'Coffee Importers',
        createdBy: createdUsers[1]._id,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log('Created sample products...');

    console.log('Database seeding completed successfully!');
    console.log('\nDemo Credentials:');
    console.log('Manager: manager@example.com / password123');
    console.log('Store Keeper: keeper@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();