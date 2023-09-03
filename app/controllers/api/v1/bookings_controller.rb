class Api::V1::BookingsController < ApplicationController
  before_action :authenticate_user!

  def index
    bookings = current_user.bookings
    render json: { bookings: }
  end

  def create
    booking = Booking.new(user: current_user, **booking_params)
    if booking.save
      render json: { result: 'success', booking: }
    else
      render json: { result: 'failed', error: booking.errors }, status: :unprocessable_entity
    end
  end

  def update
    booking = current_user.bookings.find(params[:id])
    if booking.update(booking_params)
      render json: { result: 'success', booking: }
    else
      render json: { result: 'failed', error: booking.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    booking = current_user.bookings.find(params[:id])
    booking.destroy
    render json: { result: 'success' }
  end

  private

  def booking_params
    params.require(:booking).permit(:bookingdate, :is_active, :duration, :doctor_id)
  end
end
