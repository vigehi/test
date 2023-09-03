import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { getDoctors } from '../../redux/doctors/doctorsIndex';
import DoctorsCarousel from './carousel/DoctorsCarousel';

const DoctorsIndex = () => {
  const dispatch = useDispatch();
  const doctorsState = useSelector((state) => state.doctors);

  useEffect(() => {
    if (doctorsState.status !== 'completed') {
      dispatch(getDoctors());
    }
  }, []);

  if (doctorsState.status === 'idle' || doctorsState.status === 'fetching') {
    return (
      <Container as="section" fluid className="py-2 doctors align-items-center">
        <h1 className="mt-3">Available doctors</h1>
        <div className="signout-loading">
          <Spinner animation="border" variant="primary" role="status" className="my-auto">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (doctorsState.status === 'failed') {
    return (
      <Container as="section" fluid className="py-2 doctors">
        <h2 className="mt-2">{`Something went wrong: ${doctorsState.error}`}</h2>
      </Container>
    );
  }

  return (
    <Container as="section" fluid className="py-2 doctors overflow-auto bg-light">
      <div className="my-auto">
        <div className="mt-3 mb-5">
          <h1 className="text-center">AVAILABLE DOCTORS</h1>
          <p className="text-center border-bottom mx-auto" style={{ width: 'max-content' }}>Select a doctor to continue</p>
        </div>
        {doctorsState.doctors.length
          ? (
            <Container fluid="sm" className="p-0 my-auto">
              <DoctorsCarousel items={doctorsState.doctors} />
            </Container>
          ) : (
            <Container fluid="sm">
              <p className="text-center mt-5 fs-5">There are no available doctors yet.</p>
            </Container>
          )}
      </div>
    </Container>
  );
};

export default DoctorsIndex;
