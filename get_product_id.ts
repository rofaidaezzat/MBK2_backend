
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const getProductId = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mbk2_backend";
        await mongoose.connect(MONGO_URI);

        const product = await Product.findOne({});

        if (product) {
            console.log(`REAL_PRODUCT_ID: ${product._id}`);
        } else {
            console.log('No products found in database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

getProductId();
