// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";
import WebPush from "webpush";

// Web Push通知の購読
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.ready
    .then(async (registration) => {
      const publicKey = "your-generated-public-key";

      // 通知の許可を求める
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("通知の許可が得られませんでした");
        return;
      }

      // プッシュ通知の購読を作成
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 購読情報をサーバーに送信
      await fetch("/subscriptions", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .catch((err) => {
      console.error("サービスワーカーの登録に失敗しました", err);
    });

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }
}
