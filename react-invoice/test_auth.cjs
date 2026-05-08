const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request({ hostname: 'localhost', port: 5000, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { 
        const parsed = JSON.parse(d);
        console.log(`  ${path} [${res.statusCode}]:`, JSON.stringify(parsed, null, 2));
        resolve({ status: res.statusCode, data: parsed }); 
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { resolve(JSON.parse(d)); });
    }).on('error', reject);
  });
}

(async () => {
  // Clean test: use unique username
  const testUser = 'securitytest_' + Date.now();
  const testPass = 'MySecret456';
  
  console.log('========================================');
  console.log('SECURITY TEST FOR LOGIN SYSTEM');
  console.log('========================================\n');

  console.log('1. SIGNUP new user:', testUser);
  const r1 = await post('/api/signup', { username: testUser, password: testPass, role: 'Admin' });
  console.log('   Result:', r1.data.success ? 'SUCCESS' : 'FAILED', '\n');

  console.log('2. LOGIN with CORRECT password ("' + testPass + '"):');
  const r2 = await post('/api/login', { username: testUser, password: testPass });
  console.log('   Result:', r2.status === 200 ? '✅ LOGIN SUCCESS' : '❌ LOGIN FAILED', '\n');

  console.log('3. LOGIN with WRONG password ("wrongpassword"):');
  const r3 = await post('/api/login', { username: testUser, password: 'wrongpassword' });
  console.log('   Result:', r3.status === 401 ? '✅ CORRECTLY REJECTED' : '❌ SHOULD HAVE BEEN REJECTED', '\n');

  console.log('4. LOGIN with EMPTY password (""):');
  const r4 = await post('/api/login', { username: testUser, password: '' });
  console.log('   Result:', r4.status === 401 ? '✅ CORRECTLY REJECTED' : '❌ SHOULD HAVE BEEN REJECTED', '\n');

  console.log('5. SIGNUP duplicate user (should fail):');
  const r5 = await post('/api/signup', { username: testUser, password: 'other', role: 'Admin' });
  console.log('   Result:', r5.data.success === false ? '✅ CORRECTLY REJECTED DUPLICATE' : '❌ SHOULD HAVE BEEN REJECTED', '\n');

  console.log('6. CHECK DATABASE - All users:');
  const users = await get('/api/users');
  console.log('   Total users:', users.length);
  users.forEach(u => {
    console.log(`   ID:${u.id} | Username: ${u.username} | Password: ${u.password || '(null)'} | Role: ${u.role}`);
  });

  console.log('\n========================================');
  console.log('ALL TESTS COMPLETED');
  console.log('========================================');
})();
