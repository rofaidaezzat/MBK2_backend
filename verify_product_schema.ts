
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const verifyProductSchema = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const newProduct = new Product({
            title: 'Test Product Title',
            description: 'Test Description',
            price: 99.99,
            images: ['image1.jpg', 'image2.jpg'],
            category: 'Test Category',
            sizes: ['M', 'L'],
            stock: 10,
            tags: ['READY TO SHIP', 'NEW']
        });

        const savedProduct = await newProduct.save();
        console.log('Product saved successfully:', savedProduct);

        if (savedProduct.title !== 'Test Product Title') {
            console.error('Validation Failed: Title mismatch');
        } else if (savedProduct.stock !== 10) {
            console.error('Validation Failed: Stock mismatch');
        } else if (!savedProduct.tags.includes('READY TO SHIP')) {
            console.error('Validation Failed: Tags mismatch');
        } else {
            console.log('Validation Passed: All fields correct');
        }

        await Product.findByIdAndDelete(savedProduct._id);
        console.log('Cleaned up test product');

    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyProductSchema();
