require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) do
    User.new(name: 'Nuk Tashino', email: 'nuk@tashino.com', phone: '121212', password: '123456',
             password_confirmation: '123456')
  end

  it 'should be ok with valid attributes' do
    expect(user).to be_valid
  end

  it 'should not be valid without a username' do
    user.name = nil
    expect(user).to_not be_valid
  end

  it 'should not be valid without email' do
    user.email = nil
    expect(user).to_not be_valid
  end

  it 'should not be valid without password' do
    user.password = nil
    expect(user).to_not be_valid
  end

  it 'should have password with 6 chars minimum' do
    expect(user.password.length).to be >= (6)
  end

  it 'should have password_confirmation equal to password' do
    expect(user.password).to eq(user.password_confirmation)
  end
end
