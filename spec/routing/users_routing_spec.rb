require 'rails_helper'

RSpec.describe SessionsController, type: :routing do
  describe 'routing' do
    it 'routes to #create' do
      expect(post: '/users').to route_to({ 'format' => :json, 'controller' => 'registrations', 'action' => 'create' })
    end
  end
end
