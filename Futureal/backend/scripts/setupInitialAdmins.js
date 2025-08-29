const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGODB_URI = 'mongodb+srv://kkassociates1207:bPvTTDpOslCL5M8h@cluster0.tivtk5n.mongodb.net/saisneh_hospital';

const adminCredentials = [
  {
    name: 'Dr. Sumeet Jagtap',
    adminId: 'sumeet@123',
    password: 'jagtap@123'
  },
  {
    name: 'Dr. Pallavi Jagtap',
    adminId: 'pallavi@123',
    password: 'jagtap@123'
  },
  {
    name: 'Dr. Sunil Jagtap',
    adminId: 'sunil@123',
    password: 'jagtap@123'
  }
];

async function initializeAdmins() {
  let connection;
  try {
    // Connect to MongoDB
    connection = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing admins
    await Admin.deleteMany({});
    console.log('Cleared existing admin records');

    // Create new admins one by one
    for (const adminData of adminCredentials) {
      const admin = new Admin(adminData);
      const savedAdmin = await admin.save();
      console.log(`Created admin: ${adminData.name}`);
      
      // Verify the admin was created correctly
      const foundAdmin = await Admin.findOne({ adminId: adminData.adminId });
      if (!foundAdmin) {
        throw new Error(`Failed to create admin: ${adminData.name}`);
      }
      
      // Test password comparison
      const passwordMatch = await foundAdmin.comparePassword(adminData.password);
      if (!passwordMatch) {
        throw new Error(`Password verification failed for admin: ${adminData.name}`);
      }
      console.log(`Verified password for admin: ${adminData.name}`);
    }

    console.log('All admins created and verified successfully');
  } catch (error) {
    console.error('Error initializing admins:', error);
  } finally {
    if (connection) {
      await connection.disconnect();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

initializeAdmins();
