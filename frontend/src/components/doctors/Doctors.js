import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { getDoctors } from '../../redux/doctors/doctorsIndex';
import DoctorsAdminDashboard from './DoctorsAdminDashboard';

const Doctors = () => {
  const { userSignedIn, currentUser, status: userAuthStatus } = useSelector((state) => state.auth);
  const {
    status: doctorsStatus,
    doctors,
    error: doctorsError,
  } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  useEffect(() => {
    if (doctorsStatus !== 'completed') {
      dispatch(getDoctors());
    }
  }, []);

  if (!userSignedIn && userAuthStatus !== 'signed_out') {
    return <Navigate to="/sign_in" state={{ notice: 'You need to sign in or sign up before continuing.' }} />;
  }

  if (userSignedIn && currentUser.role !== 'admin') {
    return <Navigate to="/" state={{ notice: 'Permission denied, you need admin privileges to access this page.' }} />;
  }

  const renderByStatus = (status) => {
    switch (status) {
      case 'idle':
      case 'fetching':
        return (
          <div className="signout-loading">
            <Spinner animation="border" variant="primary" role="status" className="my-auto">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        );
      case 'failed':
        return (
          <h1 className="mt-2">{`Something went wrong: ${doctorsError}`}</h1>
        );
      case 'completed':
        return (
          <DoctorsAdminDashboard doctors={doctors} />
        );
      default:
        return (
          <h1>Something weird happened¿?</h1>
        );
    }
  };

  return (
    <Container fluid className="h-100 d-flex px-sm-4 py-2 overflow-auto">
      {renderByStatus(doctorsStatus)}
    </Container>
  );
};

export default Doctors;
