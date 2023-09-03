import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { signIn, resetState } from '../../redux/auth/auth';

const SignIn = () => {
  const formInitialState = {
    email: '',
    password: '',
  };
  const authState = useSelector((state) => state.auth);
  const [formState, setFormState] = useState(formInitialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => () => dispatch(resetState()), []);

  useEffect(() => {
    if (authState.status === 'failed' && formState.password) {
      setFormState((state) => ({
        ...state,
        password: '',
      }));
    }
    if (authState.userSignedIn) {
      if (authState.status === 'success') {
        navigate('/', { state: { notice: 'Sign in successfully' } });
      } else {
        navigate('/', { state: { notice: 'You are already signed in!' } });
      }
    }
  }, [authState.status]);

  const inputHandler = (e) => {
    const key = e.target.id;
    setFormState((state) => ({
      ...state,
      [key]: e.target.value,
    }));
  };

  const formHandler = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formState).forEach((key) => {
      form.append(`user[${key}]`, formState[key]);
    });

    dispatch(signIn(form));
  };

  return (
    <Container fluid className="h-100 d-flex py-2 overflow-auto book-bg">
      <Container fluid="sm" className="py-3 border rounded form-width-sm shadow my-auto bg-light">
        <h1 className="text-center">Log In</h1>
        <Form className="mb-2 position-relative">
          <Form.Group controlId="email" className="mb-2">
            <Form.Label visuallyHidden>Email</Form.Label>
            <Form.Control value={formState.email} onChange={inputHandler} type="email" placeholder="Email" isInvalid={authState.error} />
          </Form.Group>
          <Form.Group controlId="password" className="mb-2">
            <Form.Label visuallyHidden>Password</Form.Label>
            <Form.Control value={formState.password} onChange={inputHandler} type="password" placeholder="Password" isInvalid={authState.error} />
            <Form.Control.Feedback type="invalid">{typeof authState.error === 'string' ? authState.error : ''}</Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            onClick={formHandler}
            className="text-light fw-bold px-4"
          >
            Sign In
          </Button>
          {authState.status === 'fetching'
            && (
              <div className="signout-loading">
                <Spinner animation="border" variant="primary" role="status" className="my-auto">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
        </Form>
        <p className="m-0 text-center">
          Don&apos;t have an account?
          {' '}
          <Link to="/sign_up">Sign up</Link>
        </p>
      </Container>
    </Container>
  );
};

export default SignIn;
