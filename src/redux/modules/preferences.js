import { api } from "../../utils";

// Action Types
const CREATE_PREFERENCE_REQUEST = "CREATE_PREFERENCE_REQUEST";
const CREATE_PREFERENCE_SUCCESS = "CREATE_PREFERENCE_SUCCESS";
const CREATE_PREFERENCE_FAIL = "CREATE_PREFERENCE_FAIL";

const UPDATE_PREFERENCE_REQUEST = "UPDATE_PREFERENCE_REQUEST";
const UPDATE_PREFERENCE_SUCCESS = "UPDATE_PREFERENCE_SUCCESS";
const UPDATE_PREFERENCE_FAIL = "UPDATE_PREFERENCE_FAIL";

const GET_PREFERENCE_BY_USER_REQUEST = "GET_PREFERENCE_BY_USER_REQUEST";
const GET_PREFERENCE_BY_USER_SUCCESS = "GET_PREFERENCE_BY_USER_SUCCESS";
const GET_PREFERENCE_BY_USER_FAIL = "GET_PREFERENCE_BY_USER_FAIL";

const GET_PREFERENCE_BY_ID_REQUEST = "GET_PREFERENCE_BY_ID_REQUEST";
const GET_PREFERENCE_BY_ID_SUCCESS = "GET_PREFERENCE_BY_ID_SUCCESS";
const GET_PREFERENCE_BY_ID_FAIL = "GET_PREFERENCE_BY_ID_FAIL";

const DELETE_PREFERENCE_REQUEST = "DELETE_PREFERENCE_REQUEST";
const DELETE_PREFERENCE_SUCCESS = "DELETE_PREFERENCE_SUCCESS";
const DELETE_PREFERENCE_FAIL = "DELETE_PREFERENCE_FAIL";

const GET_ALL_PREFERENCES_REQUEST = "GET_ALL_PREFERENCES_REQUEST";
const GET_ALL_PREFERENCES_SUCCESS = "GET_ALL_PREFERENCES_SUCCESS";
const GET_ALL_PREFERENCES_FAIL = "GET_ALL_PREFERENCES_FAIL";

const GET_PREFERENCE_BY_WEEK_REQUEST = "GET_PREFERENCE_BY_WEEK_REQUEST";
const GET_PREFERENCE_BY_WEEK_SUCCESS = "GET_PREFERENCE_BY_WEEK_SUCCESS";
const GET_PREFERENCE_BY_WEEK_FAIL = "GET_PREFERENCE_BY_WEEK_FAIL";

const GET_PREFERENCE_BY_SHIFT_REQUEST = "GET_PREFERENCE_BY_SHIFT_REQUEST";
const GET_PREFERENCE_BY_SHIFT_SUCCESS = "GET_PREFERENCE_BY_SHIFT_SUCCESS";
const GET_PREFERENCE_BY_SHIFT_FAIL = "GET_PREFERENCE_BY_SHIFT_FAIL";

const GET_PREFERENCE_BY_OFFDAY_REQUEST = "GET_PREFERENCE_BY_OFFDAY_REQUEST";
const GET_PREFERENCE_BY_OFFDAY_SUCCESS = "GET_PREFERENCE_BY_OFFDAY_SUCCESS";
const GET_PREFERENCE_BY_OFFDAY_FAIL = "GET_PREFERENCE_BY_OFFDAY_FAIL";

const GET_PREFERENCE_BY_WEEK_AND_SHIFT_REQUEST = "GET_PREFERENCE_BY_WEEK_AND_SHIFT_REQUEST";
const GET_PREFERENCE_BY_WEEK_AND_SHIFT_SUCCESS = "GET_PREFERENCE_BY_WEEK_AND_SHIFT_SUCCESS";
const GET_PREFERENCE_BY_WEEK_AND_SHIFT_FAIL = "GET_PREFERENCE_BY_WEEK_AND_SHIFT_FAIL";

const GET_PREFERENCE_BY_WEEK_AND_OFFDAY_REQUEST = "GET_PREFERENCE_BY_WEEK_AND_OFFDAY_REQUEST";
const GET_PREFERENCE_BY_WEEK_AND_OFFDAY_SUCCESS = "GET_PREFERENCE_BY_WEEK_AND_OFFDAY_SUCCESS";
const GET_PREFERENCE_BY_WEEK_AND_OFFDAY_FAIL = "GET_PREFERENCE_BY_WEEK_AND_OFFDAY_FAIL";

const GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_REQUEST = "GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_REQUEST";
const GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_SUCCESS = "GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_SUCCESS";
const GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_FAIL = "GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_FAIL";

// Handle Error
const handleError = (dispatch, type, error) => {
  const errorMessage = error.response?.data?.message || error.response?.data || error.message || "An unknown error occurred.";
  dispatch({ type, payload: errorMessage });
};

// Fetch Data
const fetchData = async (dispatch, requestType, successType, failType, apiCall) => {
  try {
    dispatch({ type: requestType });
    const { data } = await apiCall();
    dispatch({ type: successType, payload: data });
  } catch (error) {
    handleError(dispatch, failType, error);
  }
};

// Async Actions (Thunks)
export const createPreference = (preference) => async (dispatch) => {
  await fetchData(dispatch, CREATE_PREFERENCE_REQUEST, CREATE_PREFERENCE_SUCCESS, CREATE_PREFERENCE_FAIL, () => api.post("preferences/create", preference));
};

export const updatePreference = (id, preference) => async (dispatch) => {
  await fetchData(dispatch, UPDATE_PREFERENCE_REQUEST, UPDATE_PREFERENCE_SUCCESS, UPDATE_PREFERENCE_FAIL, () => api.put(`preferences/update/${id}`, preference));
};

export const getPreferenceByUser = (user) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_USER_REQUEST, GET_PREFERENCE_BY_USER_SUCCESS, GET_PREFERENCE_BY_USER_FAIL, () => api.get(`preferences/user/${user}`));
};

export const getPreferenceById = (id) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_ID_REQUEST, GET_PREFERENCE_BY_ID_SUCCESS, GET_PREFERENCE_BY_ID_FAIL, () => api.get(`preferences/id/${id}`));
};

export const deletePreference = (id) => async (dispatch) => {
  await fetchData(dispatch, DELETE_PREFERENCE_REQUEST, DELETE_PREFERENCE_SUCCESS, DELETE_PREFERENCE_FAIL, () => api.delete(`preferences/delete/${id}`));
};

export const getAllPreferences = () => async (dispatch) => {
  await fetchData(dispatch, GET_ALL_PREFERENCES_REQUEST, GET_ALL_PREFERENCES_SUCCESS, GET_ALL_PREFERENCES_FAIL, () => api.get("preferences/all"));
};

export const getPreferenceByWeek = (week) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_WEEK_REQUEST, GET_PREFERENCE_BY_WEEK_SUCCESS, GET_PREFERENCE_BY_WEEK_FAIL, () => api.get(`preferences/week/${week}`));
};

export const getPreferenceByShift = (shift) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_SHIFT_REQUEST, GET_PREFERENCE_BY_SHIFT_SUCCESS, GET_PREFERENCE_BY_SHIFT_FAIL, () => api.get(`preferences/shift/${shift}`));
};

export const getPreferenceByOffDay = (offDay) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_OFFDAY_REQUEST, GET_PREFERENCE_BY_OFFDAY_SUCCESS, GET_PREFERENCE_BY_OFFDAY_FAIL, () => api.get(`preferences/offday/${offDay}`));
};

export const getPreferenceByWeekAndShift = ({ week, shift }) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_WEEK_AND_SHIFT_REQUEST, GET_PREFERENCE_BY_WEEK_AND_SHIFT_SUCCESS, GET_PREFERENCE_BY_WEEK_AND_SHIFT_FAIL, () => api.get(`preferences/week/${week}/shift/${shift}`));
};

export const getPreferenceByWeekAndOffDay = ({ week, offDay }) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_WEEK_AND_OFFDAY_REQUEST, GET_PREFERENCE_BY_WEEK_AND_OFFDAY_SUCCESS, GET_PREFERENCE_BY_WEEK_AND_OFFDAY_FAIL, () => api.get(`preferences/week/${week}/offday/${offDay}`));
};

export const getPreferenceByShiftAndOffDay = ({ shift, offDay }) => async (dispatch) => {
  await fetchData(dispatch, GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_REQUEST, GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_SUCCESS, GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_FAIL, () => api.get(`preferences/shift/${shift}/offday/${offDay}`));
};

// Initial State
const initialState = {
  preferences: [],
  loading: false,
  error: null,
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_PREFERENCE_REQUEST:
    case UPDATE_PREFERENCE_REQUEST:
    case GET_PREFERENCE_BY_USER_REQUEST:
    case GET_PREFERENCE_BY_ID_REQUEST:
    case DELETE_PREFERENCE_REQUEST:
    case GET_ALL_PREFERENCES_REQUEST:
    case GET_PREFERENCE_BY_WEEK_REQUEST:
    case GET_PREFERENCE_BY_SHIFT_REQUEST:
    case GET_PREFERENCE_BY_OFFDAY_REQUEST:
    case GET_PREFERENCE_BY_WEEK_AND_SHIFT_REQUEST:
    case GET_PREFERENCE_BY_WEEK_AND_OFFDAY_REQUEST:
    case GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_REQUEST:
      return { ...state, loading: true };

    case CREATE_PREFERENCE_SUCCESS:
      return {
        ...state,
        loading: false,
        preferences: [...state.preferences, action.payload],
      };
    case UPDATE_PREFERENCE_SUCCESS:
    case GET_PREFERENCE_BY_USER_SUCCESS:
    case GET_PREFERENCE_BY_ID_SUCCESS:
    case GET_ALL_PREFERENCES_SUCCESS:
    case GET_PREFERENCE_BY_WEEK_SUCCESS:
    case GET_PREFERENCE_BY_SHIFT_SUCCESS:
    case GET_PREFERENCE_BY_OFFDAY_SUCCESS:
    case GET_PREFERENCE_BY_WEEK_AND_SHIFT_SUCCESS:
    case GET_PREFERENCE_BY_WEEK_AND_OFFDAY_SUCCESS:
    case GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_SUCCESS:
      return {
        ...state,
        loading: false,
        preferences: action.payload,
      };

    case DELETE_PREFERENCE_SUCCESS:
      return {
        ...state,
        loading: false,
        preferences: state.preferences.filter((preference) => preference._id !== action.payload._id),
      };

    case CREATE_PREFERENCE_FAIL:
    case UPDATE_PREFERENCE_FAIL:
    case GET_PREFERENCE_BY_USER_FAIL:
    case GET_PREFERENCE_BY_ID_FAIL:
    case DELETE_PREFERENCE_FAIL:
    case GET_ALL_PREFERENCES_FAIL:
    case GET_PREFERENCE_BY_WEEK_FAIL:
    case GET_PREFERENCE_BY_SHIFT_FAIL:
    case GET_PREFERENCE_BY_OFFDAY_FAIL:
    case GET_PREFERENCE_BY_WEEK_AND_SHIFT_FAIL:
    case GET_PREFERENCE_BY_WEEK_AND_OFFDAY_FAIL:
    case GET_PREFERENCE_BY_SHIFT_AND_OFFDAY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}