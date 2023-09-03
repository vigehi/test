const API_BOOKINGS_DELETE_ENDPOINT = `${process.env.REACT_APP_API_HOST}/users`;
const REQUEST_STARTED = 'book-a-doctor/usersDestroy/REQUEST_STARTED';
const REQUEST_FAILED = 'book-a-doctor/usersDestroy/REQUEST_FAILED';
const REQUEST_COMPLETED = 'book-a-doctor/usersDestroy/REQUEST_COMPLETED';
const RESET_STATE = 'book-a-doctor/usersDestroy/RESET_STATE';
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

const requestCompleted = () => ({
  type: REQUEST_COMPLETED,
  payload: {
    status: 'success',
  },
});

export const resetDestroyUserState = () => ({
  type: RESET_STATE,
  payload: {
    status: 'idle',
  },
});

export const destroyUser = () => async (dispatch, getState) => {
  dispatch(requestStarted());
  try {
    const { authToken } = getState().auth;
    const response = await fetch(API_BOOKINGS_DELETE_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'Content-type': 'Application/json',
        Authorization: authToken,
      },
    });
    if (!response.ok) {
      throw (await response.json()).error;
    }

    dispatch(requestCompleted());
  } catch (error) {
    dispatch(requestFailed(error));
  }
};

export default reducer;
