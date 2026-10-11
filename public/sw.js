self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text() || '' }; }
  event.waitUntil(self.registration.showNotification(data.title || 'HealthCopilot reminder', {
    body: data.body || 'You have a health reminder.',
    tag: data.tag || 'healthcopilot-reminder',
    data: { url: data.url || '/' },
    renotify: false,
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => client.url.startsWith(self.location.origin));
    if (existing) return existing.focus();
    return clients.openWindow(target);
  }));
});
