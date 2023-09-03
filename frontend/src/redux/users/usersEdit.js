const API_BOOKINGS_CREATE_ENDPOINT = `${process.env.REACT_APP_API_HOST}/users`;
const REQUEST_STARTED = 'book-a-doctor/usersEdit/REQUEST_STARTED';
const REQUEST_FAILED = 'book-a-doctor/usersEdit/REQUEST_FAILED';
const REQUEST_COMPLETED = 'book-a-doctor/usersEdit/REQUEST_COMPLETED';
const RESET_STATE = 'book-a-doctor/usersEdit/RESET_STATE';
const initialState = {
  status: 'idle',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_STARTED:
      return action.payload;
    case REQUEST_FAILED:
      return action.payload;
    case REQUEST_COMPLETED:
      return action.payload;
    case RESET_STATE:
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

const requestFailed = (error) => ({
  type: REQUEST_FAILED,
  payload: {
    status: 'failed',
    error,
  },
});

const requestCompleted = ({ user }) => ({
  type: REQUEST_COMPLETED,
  payload: {
    status: 'success',
    user,
  },
});

export const resetUpdateUserState = () => ({
  type: RESET_STATE,
  payload: {
    status: 'idle',
  },
});

export const updateUser = (body) => async (dispatch, getState) => {
  dispatch(requestStarted());
  try {
    const { authToken } = getState().auth;
    const response = await fetch(API_BOOKINGS_CREATE_ENDPOINT, {
      method: 'PATCH',
      body,
      headers: {
        Authorization: authToken,
      },
    });
    if (!response.ok) {
      throw (await response.json()).error;
    }

    dispatch(requestCompleted(await response.json()));
  } catch (error) {
    dispatch(requestFailed(error));
  }
};

export default reducer;
