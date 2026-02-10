import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();
const seedUser = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mbk2_backend";
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        const email = 'MBK2@admin.com';
        const password = 'mbk222';
        const name = 'MBK2 Admin';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
        } else {
            const user = await User.create({
                name,
                email,
                password,
                role: 'admin',
            });
            console.log(`User created: ${user.email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
};

seedUser();
