import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { GrFormClose } from 'react-icons/gr';
import { resetState, signUp } from '../../redux/auth/auth';
import defaultAvatar from '../../assets/images/profile-pic.png';

const SignUp = () => {
  const formInitialState = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    avatar: {
      value: '',
      preview: defaultAvatar,
      file: null,
    },
  };
  const authState = useSelector((state) => state.auth);
  const [formState, setFormState] = useState(formInitialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => () => dispatch(resetState()), []);

  useEffect(() => {
    if (authState.status === 'failed' && (formState.password || formState.password_confirmation)) {
      setFormState((state) => ({
        ...state,
        password: '',
        password_confirmation: '',
      }));
    }
    if (authState.userSignedIn) {
      if (authState.status === 'success') {
        navigate('/', { state: { notice: 'Account created successfully' } });
      } else {
        navigate('/', { state: { notice: 'You are already signed in!' } });
      }
    }
  }, [authState.status]);

  const removeSelectedPicture = () => {
    setFormState((state) => ({
      ...state,
      avatar: formInitialState.avatar,
    }));
  };

  const previewHandler = (e) => {
    if (e.target.value) {
      const file = e.target.files[0];
      setFormState((state) => ({
        ...state,
        avatar: {
          value: e.target.value,
          preview: URL.createObjectURL(file),
          file,
        },
      }));
      return undefined;
    }

    removeSelectedPicture();
    return undefined;
  };

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
    Object.keys(formState).filter((e) => e !== 'avatar').forEach((key) => {
      form.append(`user[${key}]`, formState[key]);
    });
    if (formState.avatar.file) {
      form.append('user[avatar]', formState.avatar.file);
    }

    dispatch(signUp(form));
  };

  const renderError = (key) => `${key} ${authState.error?.[key]?.join(', ')}`;
  const validateInput = (key) => !!authState.error?.[key];

  return (
    <Container fluid className="h-100 d-flex py-2 overflow-auto book-bg">
      <Container fluid="sm" className="py-3 border rounded form-width-sm shadow my-auto bg-light">
        <h1 className="text-center">Create an account</h1>
        <Form className="mb-2 position-relative">
          <div className="avatar mb-3">
            <div className="preview">
              <img src={formState.avatar.preview} alt="avatar preview" />
            </div>
            <div className="image-upload flex-grow-1">
              <div className="file-picker">
                <label htmlFor="avatar">Upload picture</label>
                <input id="avatar" type="file" onChange={previewHandler} value={formState.avatar.value} accept="image/jpeg, image/png, image/gif" />
              </div>
              <div className="file-selection">
                <small>{formState.avatar.file ? formState.avatar.file.name : 'No file chosen...'}</small>
                <button type="button" className={formState.avatar.value ? '' : 'd-none'} onClick={removeSelectedPicture}>
                  <GrFormClose />
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className={validateInput('avatar') ? 'd-block' : ''}>{renderError('avatar')}</Form.Control.Feedback>
            </div>
          </div>
          <Form.Group controlId="name" className="mb-2">
            <Form.Label visuallyHidden>Name</Form.Label>
            <Form.Control value={formState.name} onChange={inputHandler} placeholder="Name" isInvalid={validateInput('name')} />
            <Form.Control.Feedback type="invalid">{renderError('name')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email" className="mb-2">
            <Form.Label visuallyHidden>Email</Form.Label>
            <Form.Control value={formState.email} onChange={inputHandler} type="email" placeholder="Email" isInvalid={validateInput('email')} />
            <Form.Control.Feedback type="invalid">{renderError('email')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="phone" className="mb-2">
            <Form.Label visuallyHidden>Phone</Form.Label>
            <Form.Control value={formState.phone} onChange={inputHandler} type="tel" placeholder="Phone number" isInvalid={validateInput('phone')} />
            <Form.Control.Feedback type="invalid">{renderError('phone')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password" className="mb-2">
            <Form.Label visuallyHidden>Password</Form.Label>
            <Form.Control value={formState.password} onChange={inputHandler} type="password" placeholder="Password" isInvalid={validateInput('password')} />
            <Form.Control.Feedback type="invalid">{renderError('password')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password_confirmation" className="mb-2">
            <Form.Label visuallyHidden>Confirm password</Form.Label>
            <Form.Control value={formState.password_confirmation} onChange={inputHandler} type="password" placeholder="Confirm password" isInvalid={validateInput('password_confirmation')} />
            <Form.Control.Feedback type="invalid">{renderError('password_confirmation')}</Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            onClick={formHandler}
            className="text-light fw-bold px-4"
          >
            Sign Up
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
          Have you already an account?
          {' '}
          <Link to="/sign_in">Log in</Link>
        </p>
      </Container>
    </Container>
  );
};

export default SignUp;
