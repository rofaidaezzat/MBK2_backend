
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const fixAdminRole = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mbk2_backend";
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        const email = 'MBK2@admin.com';
        const user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`Updated user ${email} to role: admin`);
        } else {
            console.log(`User ${email} not found`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error fixing admin role:', error);
        process.exit(1);
    }
};

fixAdminRole();
