import React from 'react';
import Container from 'react-bootstrap/Container';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Detail from './DoctorDetails';

const Doctor = () => {
  const userSignedIn = useSelector((state) => state.auth.userSignedIn);

  if (!userSignedIn) {
    return <Navigate to="/sign_in" state={{ notice: 'You need to sign in or sign up before continuing.' }} />;
  }

  return (
    <Container fluid className="p-0 h-100 bg-light overflow-auto d-flex">
      <Detail />
    </Container>
  );
};

export default Doctor;
