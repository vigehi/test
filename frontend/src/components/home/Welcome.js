import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Container as="section" fluid className="py-2 welcome">
      <div className="text-center text-light">
        <h1>Book-a-Doctor</h1>
        <p>Welcome to NowDoctor, the only app you will need for taking care of your health</p>
        <Button type="button" onClick={() => navigate('sign_up')} className="text-light fw-bold px-4">
          GET STARTED
        </Button>
      </div>
    </Container>
  );
};

export default Welcome;
