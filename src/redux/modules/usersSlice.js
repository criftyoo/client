import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthToken, isTokenExpired } from "../../utils";
import { showAlertMessage } from "./alertsSlice";

// Async Thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired or not available");
      }
      setAuthToken(token); // Ensure token is set in headers
      const response = await api.get("/users/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
      setAuthToken(token); // Ensure token is set in headers
      const response = await api.get("/users/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const register = createAsyncThunk(
  "users/register",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/users/register", formData);
      const { token } = response.data;
      setAuthToken(token); // Ensure token is set in headers
      localStorage.setItem("token", token); // Store token in localStorage
      dispatch(loadUser());
      return response.data;
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
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", formData);
      const { token } = response.data;
      setAuthToken(token); // Ensure token is set in headers
      localStorage.setItem("token", token); // Store token in localStorage
      dispatch(loadUser());
      return response.data;
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
      return rejectWithValue(error.response?.data?.message || error.message);
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
      setAuthToken(token); // Ensure token is set in headers
      const response = await api.post("/users/updateOpenForSwap", formData);
      if (response.data.isOpenForSwap) {
        dispatch(showAlertMessage("You are now open for swaps"));
      } else {
        dispatch(showAlertMessage("You will no longer receive swap requests"));
      }
      return response.data;
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
      return rejectWithValue(error.response?.data?.message || error.message);
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
      setAuthToken(token); // Ensure token is set in headers
      const response = await api.get("/users/isOpenForSwap");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
      setAuthToken();
      localStorage.removeItem("token"); // Clear token from localStorage
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        setAuthToken(action.payload.token);
        localStorage.setItem("token", action.payload.token); // Store token in localStorage
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        setAuthToken();
        localStorage.removeItem("token"); // Clear token from localStorage
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        setAuthToken(action.payload.token);
        localStorage.setItem("token", action.payload.token); // Store token in localStorage
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        setAuthToken();
        localStorage.removeItem("token"); // Clear token from localStorage
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        setAuthToken(action.payload.token);
        localStorage.setItem("token", action.payload.token); // Store token in localStorage
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        setAuthToken();
        localStorage.removeItem("token"); // Clear token from localStorage
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
        state.users.Loading = false;
        state.users.Error = action.payload;
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