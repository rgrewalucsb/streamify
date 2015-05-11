class CreateLikes < ActiveRecord::Migration
  def change
  	create_table :likes do |t|
  		t.string   :artist
  		t.belongs_to :user

  		t.timestamps
  	end
  end
end
