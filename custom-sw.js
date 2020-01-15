// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', e => {
  const data = e.data.json();
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(data.title, {
    body: 'Peeker',
    icon:
      'https://raw.githubusercontent.com/Confidence-Okoghenun/Peeker/master/public/logo512.png'
  });
});
