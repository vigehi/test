import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import Doctor from './components/details/Details';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Bookings from './components/bookings/Bookings';
import Book from './components/book/Book';
import Account from './components/account/Account';
import Doctors from './components/doctors/Doctors';
import DoctorNew from './components/doctors/doctor-new/DoctorNew';
import DoctorEdit from './components/doctors/doctor-edit/DoctorEdit';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="doctors/:id" element={<Doctor />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="sign_up" element={<SignUp />} />
        <Route path="sign_in" element={<SignIn />} />
        <Route path="book" element={<Book />} />
        <Route path="account" element={<Account />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/new" element={<DoctorNew />} />
        <Route path="doctors/:doctorId/edit" element={<DoctorEdit />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
