enable :sessions




get '/' do
  
  erb :index
end



post '/artist' do
  api = EchoNestAPI.new
  api_response = api.artist_video(params[:artist])
  content_type :json
  api_response.to_json
end

post '/suggest' do
	api = EchoNestAPI.new
  api_response = api.suggest_artists(params[:name])
	content_type :json
  api_response.to_json
end



post '/artist_similar' do
  api =  EchoNestAPI.new
  api_response = api.artist_similar(params[:artist])
  content_type :json
  api_response.to_json
end

post '/register' do
  user = User.create(params[:user])
end

get '/login' do
  user = User.find_by(username: params[:username])
  if user.password == params[:password]
    session[:user_id] = user.id
    content_type :json
      {user_id: user.id}.to_json
  end
end

get '/logout' do  
  session[:user_id] = nil
  redirect '/'
end

put '/artist_like' do
  if session[:user_id]
    user = User.find(session[:user_id])
    user.likes << Like.create(artist: params[:artist])
  end
end

get '/likes' do  
  if session[:user_id]
    user = User.find(session[:user_id])
    likes = user.likes
    content_type :json
      likes.to_json
  end
end

post '/oembed/yt' do 
  embed_api = OembedAPI.new
  api_response = embed_api.yt_json(params[:url])
  content_type :json
  api_response.to_json
end

post '/oembed/dm' do 
  embed_api = OembedAPI.new
  api_response = embed_api.dm_json(params[:url])
  content_type :json
  api_response.to_json
end



