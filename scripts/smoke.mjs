const BASE = process.env.BASE_URL || 'http://127.0.0.1:8799';
const SECRET = process.env.TEST_BOOTSTRAP_SECRET || 'test-bootstrap-secret';
let failures = 0;

function ok(name, condition, detail = '') {
  if (condition) console.log('ok   ' + name);
  else { failures++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}

async function call(path, { method = 'GET', body, cookie } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (cookie) headers.cookie = cookie;
  const res = await fetch(BASE + '/api/' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = {};
  try { data = await res.json(); } catch {}
  return { status: res.status, data, cookie: res.headers.get('set-cookie') || '' };
}

const setup = await call('setup-status');
ok('setup-status risponde', setup.status === 200, 'status ' + setup.status);
ok('archivio inizialmente non configurato', setup.data.configured === false, JSON.stringify(setup.data));

const created = await call('setup', { method: 'POST', body: { secret: SECRET, username: 'tester', password: 'test-password-123' } });
ok('setup crea admin', created.status === 201, JSON.stringify(created.data));

const wrong = await call('login', { method: 'POST', body: { username: 'tester', password: 'sbagliata-123' } });
ok('login errato respinto', wrong.status === 401, 'status ' + wrong.status);

const login = await call('login', { method: 'POST', body: { username: 'tester', password: 'test-password-123' } });
const cookie = (login.cookie.match(/__Host-arcamis_session=[^;]+/) || [])[0];
ok('login corretto', login.status === 200 && !!cookie, 'status ' + login.status + ' cookie ' + login.cookie);
ok('cookie con prefisso __Host-', !!cookie && cookie.startsWith('__Host-arcamis_session='));

const me = await call('me', { cookie });
ok('me restituisce il ruolo admin', me.status === 200 && me.data.role === 'admin', JSON.stringify(me.data));

const anon = await call('players');
ok('lettura senza sessione respinta', anon.status === 401, 'status ' + anon.status);

const badSession = await call('players', { cookie: '__Host-arcamis_session=invalido' });
ok('sessione falsa respinta', badSession.status === 401, 'status ' + badSession.status);

const player = await call('players', { method: 'POST', cookie, body: { name: 'Aria Test', class: 'Ladra', race: 'Elfa', level: '3' } });
ok('creazione PG', player.status === 201 && !!player.data.id, JSON.stringify(player.data));

const today = new Date();
const date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
const session = await call('sessions', { method: 'POST', cookie, body: { date, type: 'Principale', title: 'Sessione smoke', summary: 'Test automatico', participants: [{ player_id: player.data.id, xp: 120 }] } });
ok('registrazione sessione XP', session.status === 201 && session.data.participants === 1, JSON.stringify(session.data));

const entries = await call('entries', { cookie });
const entry = (Array.isArray(entries.data) ? entries.data : []).find(e => e.title === 'Sessione smoke');
ok('voce XP presente con valore corretto', entry && entry.xp === 120, JSON.stringify(entry));

const backup = await call('backup', { cookie });
ok('backup completo disponibile', backup.status === 200 && backup.data.format === 'arcamis-backup-v2' && backup.data.players.length === 1, 'status ' + backup.status);

const settings = await call('settings', { cookie });
ok('backup registra last_backup_at', settings.status === 200 && !!settings.data.last_backup_at, JSON.stringify(settings.data));

const change = await call('me', { method: 'PUT', cookie, body: { current_password: 'test-password-123', new_password: 'nuova-password-456' } });
ok('cambio password', change.status === 200, JSON.stringify(change.data));

const oldLogin = await call('login', { method: 'POST', body: { username: 'tester', password: 'test-password-123' } });
ok('vecchia password non più valida', oldLogin.status === 401, 'status ' + oldLogin.status);

const newLogin = await call('login', { method: 'POST', body: { username: 'tester', password: 'nuova-password-456' } });
ok('nuova password valida', newLogin.status === 200, 'status ' + newLogin.status);

const root = await fetch(BASE + '/');
ok('pagina statica servita', root.status === 200 && (await root.text()).includes('Arcamis'));
const csp = root.headers.get('content-security-policy') || '';
ok('CSP locale consente immagini https', csp === '' || csp.includes('img-src') && csp.includes('https:'), csp);

console.log(failures ? failures + ' verifiche fallite' : 'tutte le verifiche superate');
process.exit(failures ? 1 : 0);
