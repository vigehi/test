import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useSelector, useDispatch } from 'react-redux';
import Welcome from './Welcome';
import { resetState } from '../../redux/auth/auth';
import DoctorsIndex from './DoctorsIndex';

const Home = () => {
  const { userSignedIn, status: authStatus } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authStatus === 'signed_out' || authStatus === 'signed_out_failed') dispatch(resetState());
  }, []);

  return (
    <Container fluid className="p-0 h-100">
      {userSignedIn
        ? <DoctorsIndex />
        : <Welcome />}
    </Container>
  );
};

export default Home;
