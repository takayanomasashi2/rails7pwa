# app/controllers/subscriptions_controller.rb
class SubscriptionsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    subscription = JSON.parse(request.body.read)
    # 通知送信時にこのデータを利用します（今回はデータベースに保存しません）
    Rails.logger.info("Received subscription: #{subscription}")
    render json: { message: 'Subscription created successfully' }, status: :ok
  end
end
