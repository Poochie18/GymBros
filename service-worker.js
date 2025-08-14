const CACHE_NAME = 'gym-bros-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.7/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to open cache or add URLs:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Claim clients immediately
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // we can consume one in the cache and one in the browser.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          // If fetch fails, try to serve from cache or return a fallback
          console.error('Fetch failed:', error);
          return caches.match('/index.html'); // Fallback to offline page
        });
      })
    );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-workouts') {
    event.waitUntil(syncOfflineWorkouts());
  }
});

async function syncOfflineWorkouts() {
  const firebaseConfig = {
    apiKey: "AIzaSyBZRREDgLxgxYpNKtUHZkswej5ZrWx8h3g",
    authDomain: "workout-tracker-app-b6cd8.firebaseapp.com",
    databaseURL: "https://workout-tracker-app-b6cd8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "workout-tracker-app-b6cd8",
    storageBucket: "workout-tracker-app-b6cd8.appspot.com",
    messagingSenderId: "331327932745",
    appId: "1:331327932745:web:c3a1e7b9973c5d5ee3f298",
    measurementId: "G-6E83DF6LHH"
  };

  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  const offlineWorkouts = JSON.parse(localStorage.getItem('offlineWorkouts')) || [];
  const updatedOfflineWorkouts = [];

  for (const workout of offlineWorkouts) {
    try {
      if (workout.status === 'pending') {
        const userWorkoutsRef = db.ref(`users/${workout.userUid}/workouts`);
        if (workout.action === 'add') {
          // For new workouts, push to generate a new ID
          const newRef = userWorkoutsRef.push();
          await newRef.set({ ...workout.data, id: newRef.key });
          console.log('Synced new workout:', workout.data);
        } else if (workout.action === 'update') {
          await userWorkoutsRef.child(workout.id).set(workout.data);
          console.log('Synced updated workout:', workout.data);
        } else if (workout.action === 'delete') {
          await userWorkoutsRef.child(workout.id).remove();
          console.log('Synced deleted workout:', workout.id);
        }
      }
    } catch (error) {
      console.error('Failed to sync workout:', workout, error);
      updatedOfflineWorkouts.push(workout); // Keep failed workouts for retry
    }
  }

  localStorage.setItem('offlineWorkouts', JSON.stringify(updatedOfflineWorkouts));
}