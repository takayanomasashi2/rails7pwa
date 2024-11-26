# app/controllers/notifications_controller.rb
class NotificationsController < ApplicationController
  def send_notification
    # リクエストボディから購読情報を取得
    subscription = params.require(:subscription).permit(:endpoint, keys: [:auth, :p256dh])

    # VAPID公開鍵と秘密鍵を設定（Rails環境変数から取得）
    vapid_public_key = ENV['VAPID_PUBLIC_KEY']
    vapid_private_key = ENV['VAPID_PRIVATE_KEY']

    # プッシュ通知のペイロード（送信するメッセージ）
    payload = { title: '新しい投稿があります！', body: '最新の投稿をチェックしてください。' }

    # プッシュ通知を送信
    begin
      Webpush.payload_send(
        endpoint: subscription[:endpoint],
        message: payload.to_json,
        p256dh: subscription[:keys][:p256dh],
        auth: subscription[:keys][:auth],
        vapid: {
          subject: 'mailto:your-email@example.com',
          public_key: vapid_public_key,
          private_key: vapid_private_key
        }
      )
      render json: { message: 'Notification sent successfully!' }, status: :ok
    rescue => e
      render json: { error: "Failed to send notification: #{e.message}" }, status: :unprocessable_entity
    end
  end
end

