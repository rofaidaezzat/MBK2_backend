
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();
const checkUsers = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mbk2_backend";
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        const users = await User.find({});
        console.log('Registered Users:');
        users.forEach(u => {
            console.log(`- Name: ${u.name}, Email: ${u.email}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
