const API_DOCTORS_DESTROY_ENDPOINT = `${process.env.REACT_APP_API_HOST}/api/v1/doctors`;
const REQUEST_STARTED = 'book-a-doctor/doctorDestroy/REQUEST_STARTED';
const REQUEST_FAILED = 'book-a-doctor/doctorDestroy/REQUEST_FAILED';
const REQUEST_COMPLETED = 'book-a-doctor/doctorDestroy/REQUEST_COMPLETED';
const RESET_STATE = 'book-a-doctor/doctorDestroy/RESET_STATE';
const initialState = {
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

export const resetDestroyDoctorState = () => ({
  type: RESET_STATE,
  payload: {
    status: 'idle',
  },
});

export const destroyDoctor = (id) => async (dispatch, getState) => {
  dispatch(requestStarted());
  try {
    const { authToken } = getState().auth;
    const response = await fetch(`${API_DOCTORS_DESTROY_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
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
