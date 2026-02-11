import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

async function verify() {
    try {
        console.log('Logging in...');

        // Note: Adjust credentials if they differ from expectations
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'MBK2@admin.com',
            password: 'MBK2222'
        });

        // structure might be loginRes.data.user.token or just loginRes.data.token
        // Let's inspect the login response structure if needed, but assuming standard token return
        // Based on previous convos, user model changes might affect this.
        // Let's assume standard for now, or print the whole data to debug.

        const token = loginRes.data.token || (loginRes.data.data && loginRes.data.data.token);

        if (!token) {
            console.error('Failed to get token. Login response:', JSON.stringify(loginRes.data, null, 2));
            return;
        }
        console.log('Got token.');

        console.log('Fetching stats...');
        const statsRes = await axios.get(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Stats received successfully!');
        console.log(JSON.stringify(statsRes.data, null, 2));

    } catch (error: any) {
        console.error('Error during verification:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

verify();
