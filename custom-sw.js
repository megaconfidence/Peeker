/* eslint-disable no-restricted-globals */
self.addEventListener('push', e => {
  const { title, body } = e.data.json();
  self.registration.showNotification(title, {
    body: body,
    badge:
      'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512_nobg.png',
    icon:
      'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512.png',
    actions: [{ action: 'view', title: 'View' }]
  });
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(
    self.clients.matchAll().then(clientList => {
      // default notification action
      if (clientList.length > 0) {
        clientList[0].navigate('/#/reminders').then(client => client.focus());
        return event.notification.close();
      }
      self.clients.openWindow('/#/reminders');
      return event.notification.close();
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
          '/image/icon/repeat.svg',
          '/image/icon/caret_right.svg',
          '/image/icon/trash_white.svg',
          '/image/icon/left_arrow_white.svg',
          '/image/icon/note.svg'
        ])
      )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      } else {
        const url = event.request.url;
        const res = fetch(event.request);
        if (
          url.includes('https://res.cloudinary.com/peeker/image/') ||
          url.includes('https://graph.facebook.com/') ||
          url.includes('https://lh3.googleusercontent.com/')
        ) {
          caches.open(cacheName).then(cache => {
            console.log(url);
            return cache.add(url);
          });
        }
        return res;
      }
    })
  );
});
