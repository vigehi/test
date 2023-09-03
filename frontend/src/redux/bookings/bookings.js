const API_BOOKINGS_INDEX_ENDPOINT = `${process.env.REACT_APP_API_HOST}/api/v1/bookings`;
const REQUEST_STARTED = 'book-a-doctor/bookings/REQUEST_STARTED';
const REQUEST_FAILED = 'book-a-doctor/bookings/REQUEST_FAILED';
const REQUEST_COMPLETED = 'book-a-doctor/bookings/REQUEST_COMPLETED';
const CLEAR_BOOKINGS = 'book-a-doctor/bookings/CLEAR_BOOKINGS';

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
    case CLEAR_BOOKINGS:
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

const requestCompleted = ({ bookings }) => ({
  type: REQUEST_COMPLETED,
  payload: {
    status: 'completed',
    bookings,
  },
});

export const clearBookings = () => ({
  type: CLEAR_BOOKINGS,
  payload: {
    status: 'idle',
    bookings: [],
  },
});

export const fechBookings = () => async (dispatch, getState) => {
  dispatch(requestStarted());
  try {
    const { authToken } = getState().auth;
    const response = await fetch(API_BOOKINGS_INDEX_ENDPOINT, {
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
