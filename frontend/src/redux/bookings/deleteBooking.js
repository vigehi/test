const API_BOOKINGS_DELETE_ENDPOINT = `${process.env.REACT_APP_API_HOST}/api/v1/bookings`;
const REQUEST_STARTED = 'book-a-doctor/bookingsDelete/REQUEST_STARTED';
const REQUEST_FAILED = 'book-a-doctor/bookingsDelete/REQUEST_FAILED';
const REQUEST_COMPLETED = 'book-a-doctor/bookingsDelete/REQUEST_COMPLETED';
const CLEAR_DELETE_STATE = 'book-a-doctor/bookingsDelete/CLEAR_DELETE_STATE';

const initialState = {
  bookings: [],
  status: 'idle',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_STARTED:
      return {
        ...state,
        ...action.payload,
      };
    case REQUEST_FAILED:
      return {
        ...state,
        ...action.payload,
      };
    case REQUEST_COMPLETED:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_DELETE_STATE:
      return {
        ...state,
        ...action.payload,
      };
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
    status: 'completed',
  },
});

export const clearDeleteBookingState = () => ({
  type: CLEAR_DELETE_STATE,
  payload: {
    status: 'idle',
  },
});

export const deleteBookings = (id) => async (dispatch, getState) => {
  dispatch(requestStarted());
  try {
    const { authToken } = getState().auth;
    const response = await fetch(`${API_BOOKINGS_DELETE_ENDPOINT}/${id}`, {
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
