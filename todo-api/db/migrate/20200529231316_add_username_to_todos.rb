class AddUsernameToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :username, :string
  end
end
