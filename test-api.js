// Full API test: login -> get token -> test all admin endpoints
const BASE = 'http://localhost:8080/api/v1';

async function test() {
  console.log('=== 1. LOGIN ===');
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@fitempire.in', password: 'Admin@FitEmpire2024!' })
  });
  console.log('Login Status:', loginRes.status);
  const loginData = await loginRes.json();
  console.log('Login Response:', JSON.stringify(loginData, null, 2));

  if (!loginData.data?.accessToken) {
    console.error('No access token received!');
    return;
  }

  const token = loginData.data.accessToken;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Test all admin endpoints
  const endpoints = [
    { name: 'Dashboard Stats', url: '/admin/dashboard/stats' },
    { name: 'Revenue Chart', url: '/admin/dashboard/revenue?period=week' },
    { name: 'Recent Activity', url: '/admin/dashboard/activity' },
    { name: 'Users List', url: '/admin/users?page=0&size=5' },
    { name: 'Gyms List', url: '/admin/gyms?page=0&size=5' },
    { name: 'Memberships', url: '/admin/memberships?page=0&size=5' },
    { name: 'Payments', url: '/admin/payments?page=0&size=5' },
    { name: 'Analytics Overview', url: '/admin/analytics/overview' },
    { name: 'Top Gyms', url: '/admin/analytics/top-gyms' },
    { name: 'Top Cities', url: '/admin/analytics/cities' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE}${ep.url}`, { headers });
      const body = await res.text();
      const status = res.status;
      const preview = body.substring(0, 200);
      console.log(`\n=== ${ep.name} (${status}) ===`);
      if (status !== 200) {
        console.log('FAILED:', preview);
      } else {
        console.log('OK:', preview);
      }
    } catch (err) {
      console.log(`\n=== ${ep.name} (ERROR) ===`, err.message);
    }
  }
}

test().catch(console.error);
