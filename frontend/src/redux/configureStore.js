import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth';
import doctorsIndexReducer from './doctors/doctorsIndex';
import bookingList from './bookings/bookings';
import deleteResevation from './bookings/deleteBooking';
import bookingsCreate from './bookings/bookingsCreate';
import usersEdit from './users/usersEdit';
import usersDestroy from './users/usersDestroy';
import doctorCreate from './doctors/doctorCreate';
import doctorDestroy from './doctors/doctorDestroy';
import doctorShow from './doctors/doctorShow';
import doctorUpdate from './doctors/doctorUpdate';
import bookingUpdate from './bookings/bookingUpdate';

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsIndexReducer,
    doctor_create: doctorCreate,
    doctor_destroy: doctorDestroy,
    doctor_show: doctorShow,
    doctor_update: doctorUpdate,
    bookings: bookingList,
    delResevation: deleteResevation,
    bookings_create: bookingsCreate,
    users_edit: usersEdit,
    users_destroy: usersDestroy,
    booking_update: bookingUpdate,
  },
});

export default store;
