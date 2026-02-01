import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUser = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hayah_db";
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        const email = 'hayah@gmail.com';
        const password = 'hayah123';
        const name = 'Hayah Admin';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
        } else {
            const user = await User.create({
                name,
                email,
                password,
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
