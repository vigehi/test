# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
User.destroy_all
Doctor.destroy_all
Booking.destroy_all

@user1 = User.create!(name: 'Luke', email: 'luke@skywalker.com', password: '123456', phone: '121212')
@user2 = User.create!(name: 'Obi-wan', email: 'obiwan@kenobi.com', password: '456789', phone: '414141')
@user3 = User.create!(name: 'Master Yoda', email: 'master@yoda.com', password: '12345678', phone: '424242')
@user4 = User.create!(name: 'Darth Vader', email: 'darth@vader.com', password: '234567', phone: '4327905')
@user5 = User.create!(name: 'Han Solo', email: 'han@solo.com', password: 'hanhan', phone: '123789')

@userAdmin = User.create!(name: 'Admin', email: 'admin@gmail.com', password: '12345678', phone: '424242', role: 'admin')

doctor1 = Doctor.new(name:"Dr. House",phone:'1274895',email:"doctor1@gmail.com",location:"Ireland",specialization: 'Occulist',rates:45,bio:"A very well educated doctor")
doctor1.avatar.attach(io: File.open('./app/assets/images/profile-pic.png'), filename: 'profile-pic.png')
doctor1.save

doctor2 = Doctor.new(name:"Rick",phone:123455,email:"doctor2@gmail.com",location:"Switzerland",specialization: 'Geneticist',rates: 48,bio:"A doctor form Havard")
doctor2.avatar.attach(io: File.open('./app/assets/images/profile-pic.png'), filename: 'profile-pic.png')
doctor2.save

doctor3 = Doctor.new(name:"Dr Who",phone:123455,email:"doctor3@gmail.com",location:"Laos",specialization: 'Oncologist',rates:46,bio:"A  must see doctor")
doctor3.avatar.attach(io: File.open('./app/assets/images/profile-pic.png'), filename: 'profile-pic.png')
doctor3.save

doctor4 = Doctor.new(name:"Dr Dan",phone:123455,email:"doctor4@gmail.com",location:"Nairobi",specialization: 'Psycotherapist',rates:45,bio:"Nicest Doctor")
doctor4.avatar.attach(io: File.open('./app/assets/images/profile-pic.png'), filename: 'profile-pic.png')
doctor4.save

doctor5 = Doctor.new(name:"Doctor5",phone:123455,email:"doctor5@gmail.com",location:"Switzerland",specialization: 'Pathologist',rates:42,bio:"Nice pathologist")
doctor5.avatar.attach(io: File.open('./app/assets/images/profile-pic.png'), filename: 'profile-pic.png')
doctor5.save

Booking.create(bookingdate:"2023-02-02 14:04:20.448928",is_active: true, duration: 5, user_id: 1, doctor_id: 5 )
Booking.create(bookingdate:"2023-02-03 14:04:20.448928",is_active: true, duration: 3, user_id: 2, doctor_id: 5 )
Booking.create(bookingdate:"2023-05-08 14:04:20.448928",is_active: true, duration: 2, user_id: 3, doctor_id: 5 )

Booking.create(bookingdate:"2023-02-04 14:04:20.448928",is_active: true, duration: 4, user_id: 4, doctor_id: 5 )
Booking.create(bookingdate:"2023-03-08 14:04:20.448928",is_active: true, duration: 1, user_id: 5, doctor_id: 5 )
Booking.create(bookingdate:"2023-02-02 14:04:20.448928",is_active: true, duration: 3, user_id: 5, doctor_id: 5 )

Booking.create(bookingdate:"2023-02-08 14:04:20.448928",is_active: true, duration: 5, user_id: 4, doctor_id: 5 )
Booking.create(bookingdate:"2023-07-04 14:04:20.448928",is_active: true, duration: 3, user_id: 3, doctor_id: 5 )
Booking.create(bookingdate:"2023-02-02 14:04:20.448928",is_active: true, duration: 1, user_id: 2, doctor_id: 5 )

Booking.create(bookingdate:"2023-02-02 14:04:20.448928",is_active: true, duration: 1, user_id: 1, doctor_id: 5 )
Booking.create(bookingdate:"2023-02-02 14:04:20.448928",is_active: true, duration: 4, user_id: 2, doctor_id: 5 )
Booking.create(bookingdate:"2023-02-02 14:04:20.448928",is_active: true, duration: 7, user_id: 3, doctor_id: 5 )