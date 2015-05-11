require 'bcrypt'
class User < ActiveRecord::Base
  has_many :likes
  validates :username, uniqueness: { :message => "That username is already in use!"}
  validates :username, presence: {:message => "You must enter a valid username!"}

  include BCrypt
  def password
  	@password ||= Password.new(password_hash)
  end

  def password=(new_password)
  	@password = Password.create(new_password)
  	self.password_hash = @password
  end

end
