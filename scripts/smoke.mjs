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

const plan = await call('session-plans', { method: 'POST', cookie, body: { title: 'Piano smoke', date, type: 'Principale', participants: [{ player_id: player.data.id, availability: 'available' }] } });
ok('programmazione sessione', plan.status === 201 && !!plan.data.id, JSON.stringify(plan.data));
const planId = plan.data?.id;
const completedPlan = await call('session-plans/' + planId, { method: 'PUT', cookie, body: { title: 'Piano smoke', date, status: 'completed', participants: [{ player_id: player.data.id, availability: 'available', attendance: 'present' }] } });
ok('piano completato con presenza', completedPlan.status === 200, JSON.stringify(completedPlan.data));

const item = await call('players/' + player.data.id + '/items', { method: 'POST', cookie, body: { name: 'Spada smoke', description: 'Oggetto di prova', quantity: 2, session_date: date, session_title: 'Sessione smoke' } });
ok('oggetto creato', item.status === 201 && !!item.data.id, JSON.stringify(item.data));
const itemId = item.data?.id;
const inspiration = await call('players/' + player.data.id + '/inspirations', { method: 'POST', cookie, body: { granted_on: date, notes: 'Ispirazione smoke' } });
ok('ispirazione creata', inspiration.status === 201 && !!inspiration.data.id, JSON.stringify(inspiration.data));
const inspirationId = inspiration.data?.id;

const backup = await call('backup', { cookie });
ok('backup completo disponibile', backup.status === 200 && backup.data.format === 'arcamis-backup-v3' && backup.data.players.length === 1, 'status ' + backup.status);
ok('backup include piani e presenze', Array.isArray(backup.data.plans) && backup.data.plans.some(p => p.id === planId) && Array.isArray(backup.data.participation) && backup.data.participation.some(p => p.session_id === planId && p.player_id === player.data.id && p.attendance === 'present'), JSON.stringify(backup.data.plans));
ok('backup include oggetti e ispirazioni', Array.isArray(backup.data.items) && backup.data.items.some(i => i.id === itemId) && Array.isArray(backup.data.inspirations) && backup.data.inspirations.some(i => i.id === inspirationId && i.used_on === ''), JSON.stringify(backup.data.items));

const dropItem = await call('items/' + itemId, { method: 'DELETE', cookie });
ok('oggetto eliminato prima del ripristino', dropItem.status === 200, JSON.stringify(dropItem.data));
const dropEntry = await call('entries/' + entry?.id, { method: 'DELETE', cookie });
ok('voce XP spostata nel cestino', dropEntry.status === 200, JSON.stringify(dropEntry.data));
const dropPlan = await call('session-plans/' + planId, { method: 'DELETE', cookie });
ok('piano annullato prima del ripristino', dropPlan.status === 200, JSON.stringify(dropPlan.data));

const restored = await call('restore', { method: 'POST', cookie, body: backup.data });
ok('ripristino backup v3', restored.status === 200 && restored.data.plans === 1 && restored.data.participation === 1 && restored.data.items === 1 && restored.data.inspirations === 1, JSON.stringify(restored.data));

const rewards = await call('players/' + player.data.id + '/rewards', { cookie });
ok('ripristino oggetto e ispirazione', rewards.status === 200 && rewards.data.items.some(i => i.id === itemId) && rewards.data.inspirations.some(i => i.id === inspirationId && i.used_on === ''), JSON.stringify(rewards.data));
const entriesAfter = await call('entries', { cookie });
ok('ripristino voce XP', Array.isArray(entriesAfter.data) && entriesAfter.data.some(e => e.id === entry?.id), JSON.stringify(entriesAfter.data));
const plansAfter = await call('session-plans', { cookie });
const restoredPlan = (Array.isArray(plansAfter.data) ? plansAfter.data : []).find(p => p.id === planId);
ok('ripristino piano e presenza', !!restoredPlan && restoredPlan.status === 'completed' && restoredPlan.participants.some(p => p.player_id === player.data.id && p.attendance === 'present'), JSON.stringify(restoredPlan));

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
