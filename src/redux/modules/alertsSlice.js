import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";

// Async Thunks
export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/alerts");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createAlert = createAsyncThunk(
  "alerts/createAlert",
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await api.post("/alerts", alertData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAlert = createAsyncThunk(
  "alerts/deleteAlert",
  async (alertId, { rejectWithValue }) => {
    try {
      await api.delete(`/alerts/${alertId}`);
      return alertId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  show: false,
  message: "",
  type: "info",
  alerts: [],
  loading: false,
  error: null,
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    showAlertMessage: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
    },
    hideAlertMessage: (state) => {
      state.show = false;
      state.message = "";
      state.type = "info";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts.push(action.payload);
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
      })
      .addCase(deleteAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { showAlertMessage, hideAlertMessage } = alertsSlice.actions;
export default alertsSlice.reducer;