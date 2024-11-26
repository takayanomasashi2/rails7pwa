self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "通知";
  const options = {
    body: payload.body || "新しい通知があります。",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
