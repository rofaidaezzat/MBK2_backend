
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testDirectUpload() {
    try {
        console.log("Attempting direct upload to Cloudinary via URL...");

        // Use a stable public image
        const remoteImage = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

        const result = await cloudinary.uploader.upload(remoteImage, {
            folder: 'MBK2',
            resource_type: 'auto'
        });

        console.log("Upload Success!");
        console.log("Public ID:", result.public_id);
        console.log("URL:", result.secure_url);

    } catch (error) {
        console.error("Direct Upload Failed:", error);
    }
}

testDirectUpload();
