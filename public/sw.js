const CACHE='arcamis-shell-v5',ASSETS=['/','/style.css?v=desk1','/app.js?v=20261112e','/enhanced.js?v=sort1','/logo.png','/manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||u.pathname.startsWith('/api/'))return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('/',copy));return r}).catch(()=>caches.match('/')));return}e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)))});

