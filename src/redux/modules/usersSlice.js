import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthToken, isTokenExpired } from "../../utils";
import { showAlertMessage } from "./alertsSlice";

// Helper Functions
const handleToken = (token) => {
  setAuthToken(token);
  localStorage.setItem("token", token);
};

const removeToken = () => {
  setAuthToken();
  localStorage.removeItem("token");
};

const handleError = (error, dispatch) => {
  if (error.response && error.response.data.errors) {
    error.response.data.errors.forEach((err) => {
      dispatch(showAlertMessage(err.msg, "error"));
    });
  } else if (error.response && error.response.data.message) {
    dispatch(showAlertMessage(error.response.data.message, "error"));
  } else {
    dispatch(showAlertMessage("An unknown error occurred", "error"));
  }
  return error.response?.data?.message || error.message;
};

// Async Thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired or not available");
      }
      setAuthToken(token);
      const response = await api.get("/users/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const loadUser = createAsyncThunk(
  "users/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired or not available");
      }
      setAuthToken(token);
      const response = await api.get("/users/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const register = createAsyncThunk(
  "users/register",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/users/register", formData);
      handleToken(response.data.token);
      dispatch(loadUser());
      return response.data;
    } catch (error) {
      handleError(error, dispatch);
      return rejectWithValue(handleError(error));
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", formData);
      handleToken(response.data.token);
      dispatch(loadUser());
      return response.data;
    } catch (error) {
      handleError(error, dispatch);
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateOpenForSwap = createAsyncThunk(
  "users/updateOpenForSwap",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired or not available");
      }
      setAuthToken(token);
      const response = await api.post("/users/updateOpenForSwap", formData);
      dispatch(showAlertMessage({show: true,msg: response.data.isOpenForSwap ? "You are now open for swaps" : "You will no longer receive swap requests"}));
      console.log(response.data);
      return response.data;
    } catch (error) {
      handleError(error, dispatch);
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchIsOpenForSwap = createAsyncThunk(
  "users/fetchIsOpenForSwap",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired or not available");
      }
      setAuthToken(token);
      const response = await api.get("/users/isOpenForSwap");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const logout = createAsyncThunk("users/logout", async (_, { dispatch }) => {
  dispatch(usersSlice.actions.logout());
});

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isOpenForSwap: false,
  loading: true,
  user: null,
  users: [],
  usersLoading: false,
  usersError: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      removeToken();
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        removeToken();
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        removeToken();
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        removeToken();
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(updateOpenForSwap.fulfilled, (state, action) => {
        state.isOpenForSwap = action.payload.isOpenForSwap;
        state.loading = false;
      })
      .addCase(updateOpenForSwap.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.usersLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      .addCase(fetchIsOpenForSwap.fulfilled, (state, action) => {
        state.isOpenForSwap = action.payload.isOpenForSwap;
      })
      .addCase(fetchIsOpenForSwap.rejected, (state) => {
        state.isOpenForSwap = false;
      });
  },
});

export const { logout: logoutAction } = usersSlice.actions;
export default usersSlice.reducer;