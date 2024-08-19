import { api, setAuthToken } from "../../utils";
import { showAlertMessage } from "./alerts";

const REGISTER_SUCCESS = "users/REGISTER_SUCCESS";
const REGISTER_FAIL = "users/REGISTER_FAIL";
const USER_LOADED = "users/USER_LOADED";
const USER_ERROR = "users/USER_ERROR";
const LOGIN_SUCCESS = "users/LOGIN_SUCCESS";
const LOGIN_FAIL = "users/LOGIN_FAIL";
const LOGOUT = "users/LOGOUT";

export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/users/me");
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (error) {
    dispatch({ type: USER_ERROR });
  }
};

export function register(formData) {
  return async function registerThunk(dispatch) {
    try {
      const res = await api.post("/users/register", formData);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      dispatch(loadUser());
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        errors.forEach((error) => {
          dispatch(showAlertMessage(error.msg, "error"));
        });
      } else if (error.response && error.response.data.message) {
        dispatch(showAlertMessage(error.response.data.message, "error"));
      } else {
        dispatch(showAlertMessage("An unknown error occurred", "error"));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
}

export const login = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/users/login", formData);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (error) {
    if (error.response && error.response.data.errors) {
      const errors = error.response.data.errors;
      errors.forEach((error) => {
        dispatch(showAlertMessage(error.msg, "error"));
      });
    } else if (error.response && error.response.data.message) {
      dispatch(showAlertMessage(error.response.data.message, "error"));
    } else {
      dispatch(showAlertMessage("An unknown error occurred", "error"));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      setAuthToken(payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      setAuthToken();
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case USER_ERROR:
      setAuthToken();
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}
