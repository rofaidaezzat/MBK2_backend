import "dotenv/config";
import cloudinary from "./src/config/cloudinary.js";

async function testCloudinary() {
    try {
        console.log("Testing Cloudinary connection...");
        console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
        console.log("API Key present:", !!process.env.CLOUDINARY_API_KEY);
        console.log("API Secret present:", !!process.env.CLOUDINARY_API_SECRET);

        const result = await cloudinary.api.ping();
        console.log("Cloudinary Ping Result:", result);
    } catch (error) {
        console.error("Cloudinary Error:", error);
    }
}
testCloudinary();
