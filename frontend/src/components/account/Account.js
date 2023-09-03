import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { GrFormClose } from 'react-icons/gr';
import { updateUser, resetUpdateUserState } from '../../redux/users/usersEdit';
import { destroyUser, resetDestroyUserState } from '../../redux/users/usersDestroy';
import { updateCurrentUser, signOut } from '../../redux/auth/auth';
import defaultAvatar from '../../assets/images/profile-pic.png';

const Account = () => {
  const userState = useSelector((state) => state.users_edit);
  const userDeleteState = useSelector((state) => state.users_destroy);
  const { userSignedIn, currentUser } = useSelector((state) => state.auth);
  const formInitialState = {
    name: currentUser?.name,
    email: currentUser?.email,
    phone: currentUser?.phone,
    password: '',
    password_confirmation: '',
    current_password: '',
    avatar: {
      value: '',
      preview: currentUser?.avatar || defaultAvatar,
      file: null,
    },
  };
  const [formState, setFormState] = useState(formInitialState);
  const [showCancelAccount, setShowCancelAccount] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.status === 'failed') {
      setFormState((state) => ({
        ...state,
        password: '',
        password_confirmation: '',
        current_password: '',
      }));
    }
    if (typeof userState.error === 'string') {
      navigate('/account', { state: { notice: `Something went wrong: ${userState.error}` } });
    }
    if (userDeleteState.status === 'failed') {
      navigate('/account', { state: { notice: `Something went wrong: ${userDeleteState.error}` } });
    }
    if (userState.status === 'success') {
      navigate('/', { state: { notice: 'Account updated successfully.' } });
      dispatch(updateCurrentUser(userState.user));
    }
    if (userDeleteState.status === 'success') {
      navigate('/account', { state: { notice: 'Account canceled successfully.' } });
      dispatch(signOut());
    }
  }, [userState.status, userDeleteState.status]);

  useEffect(() => {
    if (!userSignedIn) {
      navigate('/sign_in', { state: { notice: 'You need to sign in or sign up before continuing.' } });
    }
    return () => {
      dispatch(resetUpdateUserState());
      dispatch(resetDestroyUserState());
    };
  }, []);

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
        remove_avatar: '',
      }));
      return undefined;
    }

    removeSelectedPicture();
    return undefined;
  };

  const removeCurrentAvatar = () => setFormState((state) => ({
    ...state,
    avatar: {
      value: '',
      preview: defaultAvatar,
      file: null,
    },
    remove_avatar: true,
  }));

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

    dispatch(updateUser(form));
  };

  const renderError = (key) => `${key} ${userState.error?.[key]?.join(', ')}`;
  const validateInput = (key) => !!userState.error?.[key];

  return (
    <Container fluid className="h-100 book-bg d-flex py-2 overflow-auto">
      <Container fluid="sm" className="py-3 border rounded form-width-sm shadow my-auto bg-light">
        <h1 className="text-center">Edit Pofile</h1>
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
              {(currentUser?.avatar === formState.avatar.preview && !formState.avatar.file)
                && <Button variant="link" size="sm" className="p-0" onClick={removeCurrentAvatar}>Remove profile picture</Button>}
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
            <Form.Label visuallyHidden>
              Password (leave blank if you don&apos;t want to change it)
            </Form.Label>
            <Form.Control value={formState.password} onChange={inputHandler} type="password" placeholder="Password (leave blank if you don't want to change it)" isInvalid={validateInput('password')} />
            <Form.Control.Feedback type="invalid">{renderError('password')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password_confirmation" className="mb-2">
            <Form.Label visuallyHidden>Confirm password</Form.Label>
            <Form.Control value={formState.password_confirmation} onChange={inputHandler} type="password" placeholder="Confirm password" isInvalid={validateInput('password_confirmation')} />
            <Form.Control.Feedback type="invalid">{renderError('password_confirmation')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="current_password" className="mb-2">
            <Form.Label visuallyHidden>
              Current Password (we need your current password to confirm your changes)
            </Form.Label>
            <Form.Control value={formState.current_password} onChange={inputHandler} type="password" placeholder="Current Password (we need your current password to confirm your changes)" isInvalid={validateInput('current_password')} />
            <Form.Control.Feedback type="invalid">{renderError('current_password')}</Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            onClick={formHandler}
            className="text-light fw-bold px-4"
          >
            Update
          </Button>
          {showCancelAccount
            ? (
              <p className="m-0 text-center">
                Are you sure?
                {' '}
                <Button onClick={() => dispatch(destroyUser())} variant="primary" className="px-2 py-1 me-2">Yes</Button>
                <Button onClick={() => setShowCancelAccount(false)} variant="secondary" className="px-2 py-1">No</Button>
              </p>
            )
            : (
              <p className="m-0 text-center">
                Unhappy?
                {' '}
                <Button onClick={() => setShowCancelAccount(true)} variant="link" className="p-0">Cancel my account</Button>
              </p>
            )}
          {(userState.status === 'fetching' || userDeleteState.status === 'fetching')
            && (
              <div className="signout-loading">
                <Spinner animation="border" variant="primary" role="status" className="my-auto">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
        </Form>
      </Container>
    </Container>
  );
};

export default Account;