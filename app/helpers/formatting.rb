helpers do
  def em(text)
    "<em>#{text}</em>"
  end

  
end


require 'httparty'
require 'uri'

API_KEY = "YFELLLW97RR476HV0"
FORMAT = "json"
BASE_URL = "http://developer.echonest.com/api/v4/artist/video?api_key=#{API_KEY}&format=#{FORMAT}&name="



# Or wrap things up in your own class
class EchoNestAPI
  include HTTParty
  base_uri 'developer.echonest.com/api/v4'

  def initialize
    @options = { query: {api_key: API_KEY, format: FORMAT} }
  end

  def artist_video(artist_name)
  	options = @options.clone
  	options[:query][:name] =  artist_name
    self.class.get("/artist/video", options)
  end

  def artist_similar(artist_name)
    options = @options.clone
    options[:query][:name] =  artist_name
    self.class.get("/artist/similar", options)
  end

  def suggest_artists(term)
    options = @options.clone
    options[:query][:name] =  term
    options[:query][:results] =  '12'
    self.class.get("/artist/suggest", options)
  end
end

class OembedAPI
  include HTTParty

  def yt_json(link)
    self.class.get("http://www.youtube.com/oembed?format=json&url=#{link}")
  end

  def dm_json(link)
    self.class.get("http://www.dailymotion.com/services/oembed?format=json&url=#{link}")
  end
end