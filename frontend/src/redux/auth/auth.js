const API_SIGNUP_ENDPOINT = `${process.env.REACT_APP_API_HOST}/users`;
const API_SIGNIN_ENDPOINT = `${process.env.REACT_APP_API_HOST}/users/sign_in`;
const API_SIGNOUT_ENDPOINT = `${process.env.REACT_APP_API_HOST}/users/sign_out`;
const REQUEST_STARTED = 'book-a-doctor/auth/REQUEST_STARTED';
const SIGNOUT_STARTED = 'book-a-doctor/auth/SIGNOUT_STARTED';
const REQUEST_FAILED = 'book-a-doctor/auth/REQUEST_FAILED';
const SIGNOUT_FAILED = 'book-a-doctor/auth/SIGNOUT_FAILED';
const REQUEST_COMPLETED = 'book-a-doctor/auth/REQUEST_COMPLETED';
const SIGNOUT_COMPLETED = 'book-a-doctor/auth/SIGNOUT_COMPLETED';
const RESET_STATE = 'book-a-doctor/auth/RESET_STATE';
const UPDATE_CURRENT_USER = 'book-a-doctor/auth/UPDATE_CURRENT_USER';
const initialState = () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth) {
    return {
      status: 'idle',
      userSignedIn: true,
      authToken: auth.token,
      currentUser: auth.user,
    };
  }

  return {
    status: 'idle',
    userSignedIn: false,
  };
};

const reducer = (state = initialState(), action) => {
  switch (action.type) {
    case REQUEST_STARTED:
    case SIGNOUT_STARTED:
      return {
        ...state,
        ...action.payload,
      };
    case REQUEST_FAILED:
    case SIGNOUT_FAILED:
      return {
        ...state,
        ...action.payload,
      };
    case REQUEST_COMPLETED:
      localStorage.setItem('auth', JSON.stringify({
        token: action.payload.authToken,
        user: action.payload.currentUser,
      }));
      return {
        ...state,
        ...action.payload,
      };
    case RESET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_CURRENT_USER:
      localStorage.setItem('auth', JSON.stringify({
        token: state.authToken,
        user: action.payload.currentUser,
      }));
      return {
        ...state,
        ...action.payload,
      };
    case SIGNOUT_COMPLETED:
      localStorage.removeItem('auth');
      return action.payload;
    default:
      return state;
  }
};

const requestStarted = () => ({
  type: REQUEST_STARTED,
  payload: {
    status: 'fetching',
  },
});

const signoutRequestStarted = () => ({
  type: SIGNOUT_STARTED,
  payload: {
    status: 'fetching_signout',
  },
});

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  payload: {
    status: 'failed',
    error,
  },
});

const signoutRequestFailed = (error) => ({
  type: SIGNOUT_FAILED,
  payload: {
    status: 'signed_out_failed',
    error,
  },
});

const requestCompleted = (response) => ({
  type: REQUEST_COMPLETED,
  payload: {
    status: 'success',
    userSignedIn: true,
    authToken: response.token,
    currentUser: response.user,
  },
});

const signoutRequestCompleted = () => ({
  type: SIGNOUT_COMPLETED,
  payload: {
    status: 'signed_out',
    userSignedIn: false,
  },
});

export const resetState = () => ({
  type: RESET_STATE,
  payload: {
    status: 'idle',
    error: undefined,
  },
});

export const updateCurrentUser = (user) => ({
  type: UPDATE_CURRENT_USER,
  payload: {
    currentUser: user,
  },
});

export const signUp = (body) => async (dispatch) => {
  dispatch(requestStarted());
  try {
    const response = await fetch(API_SIGNUP_ENDPOINT, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      throw (await response.json()).error;
    }

    dispatch(requestCompleted({
      token: response.headers.get('Authorization'),
      user: (await response.json()).user,
    }));
  } catch (error) {
    dispatch(requestFailed(error));
  }
};

export const signIn = (body) => async (dispatch) => {
  dispatch(requestStarted());
  try {
    const response = await fetch(API_SIGNIN_ENDPOINT, {
      method: 'POST',
      body,
    });
    if (!response.ok) {
      throw (await response.json()).error;
    }

    dispatch(requestCompleted({
      token: response.headers.get('Authorization'),
      user: (await response.json()).user,
    }));
  } catch (error) {
    dispatch(requestFailed(error));
  }
};

export const signOut = () => async (dispatch, getState) => {
  dispatch(signoutRequestStarted());
  try {
    const { authToken } = getState().auth;
    const response = await fetch(API_SIGNOUT_ENDPOINT, {
      method: 'DELETE',
      headers: {
        Authorization: authToken,
      },
    });
    if (!response.ok) {
      throw (await response.json()).error;
    }

    dispatch(signoutRequestCompleted());
  } catch (error) {
    dispatch(signoutRequestFailed(error));
  }
};

export default reducer;
