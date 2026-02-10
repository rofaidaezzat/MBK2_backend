
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUpload(extension) {
    try {
        const axios = (await import('axios')).default;
        const FormData = (await import('form-data')).default;

        // Valid minimal JPEG
        const jpegBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAAFgAAQAAAAAAAAAAAAAAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//2Q==';
        const buffer = Buffer.from(jpegBase64, 'base64');

        const fileName = `test-image.${extension}`;
        const imagePath = path.join(__dirname, fileName);
        fs.writeFileSync(imagePath, buffer);

        const form = new FormData();
        form.append('title', `Test Product ${extension} ` + Date.now());
        form.append('description', 'Test Description');
        form.append('price', '100');
        form.append('category', 'electronics');
        form.append('stock', '10');
        form.append('tags', '["test"]');
        form.append('images', fs.createReadStream(imagePath));

        const headers = form.getHeaders();

        console.log(`Testing upload with ${fileName}...`);

        const response = await axios.post('http://localhost:5000/api/v1/products', form, {
            headers: headers,
            validateStatus: () => true
        });

        console.log('Response Status:', response.status);
        console.log('Response Body:', JSON.stringify(response.data, null, 2));

        // Clean up
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

async function runTests() {
    await testUpload('jpg');
    console.log('---');
    await testUpload('JPG');
}

runTests();
