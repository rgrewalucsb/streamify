class Like < ActiveRecord::Base
  belongs_to :user
  validates :user, uniqueness: { scope: :artist}
end
