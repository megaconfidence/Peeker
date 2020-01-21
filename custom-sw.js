/* eslint-disable no-restricted-globals */
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: `${data.body}... at ${data.time}`,
    badge:
      'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512.png',
    icon:
      'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512.png'
  });
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(
    self.clients.matchAll().then(clientList => {
      if (clientList.length > 0) {
        return clientList[0]
          .navigate('/#/reminders')
          .then(client => client.focus());
      }
      return self.clients.openWindow('/#/reminders');
    })
  );
});

const cacheName = 'PEEKER_CACHE';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache =>
        cache.addAll([
          '/image/icon/badge.svg',
          '/image/icon/alarm.svg',
          '/image/icon/plus.svg',
          '/image/icon/palate.svg',
          '/image/icon/picture.svg',
          '/image/icon/archive.svg',
          '/image/icon/trash.svg',
          '/image/icon/options.svg',
          '/image/icon/undo.svg',
          '/image/icon/redo.svg',
          '/image/icon/pin.svg',
          '/image/icon/pin_fill.svg',
          '/image/icon/close.svg',
          '/image/icon/search.svg',
          '/image/icon/add_contact.svg',
          '/image/icon/refresh.svg',
          '/image/icon/settings.svg',
          '/image/icon/hamburger.svg',
          '/image/icon/bulb.svg',
          '/image/icon/bell.svg',
          '/image/icon/checkbox.svg',
          '/image/icon/checkbox_notchecked.svg',
          '/image/icon/profile.svg',
          '/image/icon/left_arrow.svg',
          '/image/icon/peeker.png',
          '/image/icon/repeat.svg'
        ])
      )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

