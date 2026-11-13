const BASE = process.env.BASE_URL || 'http://127.0.0.1:8800';
const res = await fetch(BASE + '/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'legacy', password: 'legacy-password-123' }) });
const data = await res.json().catch(() => ({}));
if (res.status !== 200) { console.log('FAIL login legacy — status ' + res.status + ' ' + JSON.stringify(data)); process.exit(1); }
console.log('ok   login legacy con hash precedente');
