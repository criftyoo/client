import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";
import { showAlertMessage } from "./alertsSlice";

// Async Thunks
export const fetchSchedulesAction = createAsyncThunk(
  "employee/fetchSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/schedules/all");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const createSwapRequestAction = createAsyncThunk(
  "employee/createSwapRequest",
  async (
    { recipientScheduleId, requesterScheduleId, recipientId, requesterId },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/swap/request", {
        recipientSchedule: recipientScheduleId,
        recipient: recipientId,
        requester: requesterId,
        requesterSchedule: requesterScheduleId,
      });

      dispatch(showAlertMessage("Swap Request Sent To The User Successfully"));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(showAlertMessage(errorMessage, "error"));
      return rejectWithValue(errorMessage);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    schedules: [],
    loadingSchedules: false,
    loadingSwap: false,
    error: null,
    swapRequest: null,
  },
  reducers: {
    resetSwapRequest: (state) => {
      state.swapRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Schedules
      .addCase(fetchSchedulesAction.pending, (state) => {
        state.loadingSchedules = true;
        state.error = null;
      })
      .addCase(fetchSchedulesAction.fulfilled, (state, action) => {
        state.loadingSchedules = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedulesAction.rejected, (state, action) => {
        state.loadingSchedules = false;
        state.error = action.payload;
      })
      // Create Swap Request
      .addCase(createSwapRequestAction.pending, (state) => {
        state.loadingSwap = true;
        state.error = null;
      })
      .addCase(createSwapRequestAction.fulfilled, (state, action) => {
        state.loadingSwap = false;
        state.swapRequest = action.payload;
      })
      .addCase(createSwapRequestAction.rejected, (state, action) => {
        state.loadingSwap = false;
        state.error = action.payload;
      });
  },
});

export const { resetSwapRequest } = employeeSlice.actions;
export default employeeSlice.reducer;