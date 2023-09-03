require 'rails_helper'

RSpec.describe Doctor, type: :model do
  describe 'validation tests' do
    subject do
      @usero = User.new(name: 'Izumi', email: 'izumi@mail.com', password: '123456', password_confirmation: '123456')
      Doctor.new(name: 'Rick', location: 'Ireland', specialization: 'Pathologist', rates: 400)
    end
    before { subject.save }

    it 'should have a name' do
      subject.name = nil
      expect(subject).to_not be_valid
    end

    it 'should have a location' do
      subject.location = nil
      expect(subject).to_not be_valid
    end

    it 'should declare a specialization' do
      subject.specialization = nil
      expect(subject).to_not be_valid
    end

    it 'should have a rate greater than 0' do
      subject.rates = -40
      expect(subject).to_not be_valid
    end
  end
end
