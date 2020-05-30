Rails.application.routes.draw do
  
    scope '/api/v1' do
      resources :todos
      resources :users
    end
end
