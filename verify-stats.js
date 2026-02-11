const API_URL = 'http://localhost:5000/api/v1';

async function verify() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'MBK2@admin.com',
                password: 'mbk222'
            })
        });
        if (!loginRes.ok) {
            const errText = await loginRes.text();
            console.error('Login failed:', loginRes.status, errText);
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token || (loginData.data && loginData.data.token);

        if (!token) {
            console.error('No token found in login response', loginData);
            return;
        }
        console.log('Got token.');

        console.log('Fetching stats...');
        const statsRes = await fetch(`${API_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!statsRes.ok) {
            const errText = await statsRes.text();
            console.error('Stats fetch failed:', statsRes.status, errText);
            return;
        }

        const statsData = await statsRes.json();
        console.log('Stats received successfully!');
        console.log(JSON.stringify(statsData, null, 2));

    } catch (error) {
        console.error('Script error:', error);
    }
}

verify();
