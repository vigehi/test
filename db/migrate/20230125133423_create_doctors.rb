class CreateDoctors < ActiveRecord::Migration[7.0]
  def change
    create_table :doctors do |t|
      t.string :name
      t.string :location
      t.string :phone
      t.string :email
      t.decimal :rates
      t.string :specialization
      t.text :bio

      t.timestamps
    end
  end
end
