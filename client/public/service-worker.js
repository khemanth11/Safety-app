/* =====================================================
   Safety App — Service Worker
   Strategy:
     • Cache-First  → static assets (JS, CSS, images)
     • Network-First → API calls (/api/)
   ===================================================== */

const CACHE_NAME = 'calculator-app-v1';

// Core shell files to cache on install
const SHELL_ASSETS = [
    '/',
    '/index.html',
    '/static/js/main.chunk.js',
    '/static/js/bundle.js',
    '/static/js/vendors~main.chunk.js',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
];

// ── INSTALL ──────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching shell assets');
            // Use addAll but don't fail install if some assets are missing
            return Promise.allSettled(
                SHELL_ASSETS.map((url) => cache.add(url).catch(() => { }))
            );
        })
    );
    // Take control immediately without waiting for old SW to be gone
    self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            )
        )
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Network-First for API calls — alerts must go through!
    if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache-First for everything else
    event.respondWith(cacheFirst(request));
});

// ── Strategies ───────────────────────────────────────

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached || new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
