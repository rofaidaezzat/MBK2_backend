
const BASE_URL = 'http://localhost:5000/api/v1';

async function testEndpoints() {
    console.log('Testing Exposing Public Endpoints...');

    // Helper for requests
    async function request(path: string, options: RequestInit = {}) {
        try {
            const response = await fetch(`${BASE_URL}${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                }
            });
            return response;
        } catch (error) {
            console.error(`Request failed to ${path}:`, error);
            return null;
        }
    }

    // 1. Test GET /products (Should be Public)
    const productsRes = await request('/products');
    if (productsRes) {
        if (productsRes.status === 200) {
            console.log('✅ GET /products is PUBLIC (Success)');
        } else if (productsRes.status === 401) {
            console.error('❌ GET /products is still PROTECTED (Failed)');
        } else {
            console.log(`⚠️ GET /products returned ${productsRes.status} (Check server status)`);
        }
    }

    // 2. Test createContact (POST /contact) (Should be Public)
    const contactRes = await request('/contact', {
        method: 'POST',
        body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message'
        })
    });

    if (contactRes) {
        if (contactRes.status === 201 || contactRes.status === 200) {
            console.log('✅ POST /contact is PUBLIC (Success)');
        } else if (contactRes.status === 401) {
            console.error('❌ POST /contact is PROTECTED (Failed)');
        } else {
            console.log(`✅ POST /contact returned ${contactRes.status} (Likely passes auth check if not 401)`);
        }
    }

    // 3. Test Create Product (POST /products) (Should be Protected)
    const createProductRes = await request('/products', {
        method: 'POST',
        body: JSON.stringify({})
    });

    if (createProductRes) {
        if (createProductRes.status === 401) {
            console.log('✅ POST /products is PROTECTED (Success)');
        } else {
            console.error(`❌ POST /products returned ${createProductRes.status} (Failed - Should be Protected)`);
        }
    }
}

testEndpoints();
