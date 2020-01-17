/* eslint-disable no-restricted-globals */
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: `${data.body}... at ${data.time}`,
    badge: 'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512.png',
    icon:
      'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512.png'
  });
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
    self.clients.matchAll().then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0]
          .navigate('/#/reminders')
          .then(client => client.focus());
      }
      return self.clients.openWindow('/#/reminders');
    })
  );
});
