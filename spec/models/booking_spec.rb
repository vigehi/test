require 'rails_helper'

RSpec.describe Booking, type: :model do
  describe 'validation tests' do
    subject do
      @usero = User.new(name: 'Nuk Tashino', email: 'nuk@tashino.com', phone: '121212', password: '123456',
                        password_confirmation: '123456')
      @doctoro = Doctor.new(name: 'Rick', location: 'Ireland',
                            specialization: 'Pathologist', rates: 400)
      Booking.new(user_id: @usero.id, doctor_id: @doctoro.id, bookingdate: '27-01-2023 12:40:00')
    end

    before { subject.save }

    it 'booking date should be present' do
      subject.bookingdate = nil
      expect(subject).to_not be_valid
    end
  end
end
