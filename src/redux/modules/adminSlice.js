import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthToken, isTokenExpired } from "../../utils";
import { showAlertMessage } from "./alertsSlice";

// Async Thunks
export const uploadSchedule = createAsyncThunk(
  "admin/uploadSchedule",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/schedules/upload", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSchedules = createAsyncThunk(
  "admin/fetchSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/schedules/all");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllSchedulesWithWorkingHours = createAsyncThunk(
  "admin/fetchAllSchedulesWithWorkingHours",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/schedules/available-schedules");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSwaps = createAsyncThunk(
  "admin/fetchSwaps",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/swap/swaps");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchReceivedSwaps = createAsyncThunk(
  "admin/fetchReceivedSwaps",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/swap/received/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSentSwaps = createAsyncThunk(
  "admin/fetchSentSwaps",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/swap/sent/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSwapStatus = createAsyncThunk(
  "admin/updateSwapStatus",
  async ({ swapId, status, message, role, adminStatus }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/swap/update/${swapId}`, { status, message, role, adminStatus });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const requestScheduleSwap = createAsyncThunk(
  "admin/requestScheduleSwap",
  async (swapId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/swap/request`, { swapId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchApprovedSwapRequests = createAsyncThunk(
  "admin/fetchApprovedSwapRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/swap/swap/approved-requests");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  schedules: [],
  swaps: {
    received: [],
    sent: [],
    all: [],
    approved: [],
  },
  loading: {
    upload: false,
    allSwaps: false,
    receivedSwaps: false,
    sentSwaps: false,
    updateSwap: false,
    requestSwap: false,
    allSchedules: false,
    approvedSwaps: false,
  },
  uploadProgress: 0,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearUploadError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSchedule.pending, (state) => {
        state.loading.upload = true;
        state.error = null;
      })
      .addCase(uploadSchedule.fulfilled, (state, action) => {
        state.loading.upload = false;
        state.schedules.push(action.payload);
      })
      .addCase(uploadSchedule.rejected, (state, action) => {
        state.loading.upload = false;
        state.error = action.payload;
      })
      .addCase(fetchSchedules.pending, (state) => {
        state.loading.allSchedules = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading.allSchedules = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading.allSchedules = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSchedulesWithWorkingHours.pending, (state) => {
        state.loading.allSchedules = true;
        state.error = null;
      })
      .addCase(fetchAllSchedulesWithWorkingHours.fulfilled, (state, action) => {
        state.loading.allSchedules = false;
        state.schedules = action.payload;
      })
      .addCase(fetchAllSchedulesWithWorkingHours.rejected, (state, action) => {
        state.loading.allSchedules = false;
        state.error = action.payload;
      })
      .addCase(fetchSwaps.pending, (state) => {
        state.loading.allSwaps = true;
        state.error = null;
      })
      .addCase(fetchSwaps.fulfilled, (state, action) => {
        state.loading.allSwaps = false;
        state.swaps.all = action.payload;
      })
      .addCase(fetchSwaps.rejected, (state, action) => {
        state.loading.allSwaps = false;
        state.error = action.payload;
      })
      .addCase(fetchReceivedSwaps.pending, (state) => {
        state.loading.receivedSwaps = true;
        state.error = null;
      })
      .addCase(fetchReceivedSwaps.fulfilled, (state, action) => {
        state.loading.receivedSwaps = false;
        state.swaps.received = action.payload;
      })
      .addCase(fetchReceivedSwaps.rejected, (state, action) => {
        state.loading.receivedSwaps = false;
        state.error = action.payload;
      })
      .addCase(fetchSentSwaps.pending, (state) => {
        state.loading.sentSwaps = true;
        state.error = null;
      })
      .addCase(fetchSentSwaps.fulfilled, (state, action) => {
        state.loading.sentSwaps = false;
        state.swaps.sent = action.payload;
      })
      .addCase(fetchSentSwaps.rejected, (state, action) => {
        state.loading.sentSwaps = false;
        state.error = action.payload;
      })
      .addCase(updateSwapStatus.pending, (state) => {
        state.loading.updateSwap = true;
        state.error = null;
      })
      .addCase(updateSwapStatus.fulfilled, (state, action) => {
        state.loading.updateSwap = false;
        // Update the swap status in the state
        const index = state.swaps.all.findIndex(swap => swap.id === action.payload.id);
        if (index !== -1) {
          state.swaps.all[index] = action.payload;
        }
      })
      .addCase(updateSwapStatus.rejected, (state, action) => {
        state.loading.updateSwap = false;
        state.error = action.payload;
      })
      .addCase(requestScheduleSwap.pending, (state) => {
        state.loading.requestSwap = true;
        state.error = null;
      })
      .addCase(requestScheduleSwap.fulfilled, (state, action) => {
        state.loading.requestSwap = false;
        state.swaps.all.push(action.payload);
      })
      .addCase(requestScheduleSwap.rejected, (state, action) => {
        state.loading.requestSwap = false;
        state.error = action.payload;
      })
      .addCase(fetchApprovedSwapRequests.pending, (state) => {
        state.loading.approvedSwaps = true;
        state.error = null;
      })
      .addCase(fetchApprovedSwapRequests.fulfilled, (state, action) => {
        state.loading.approvedSwaps = false;
        state.swaps.approved = action.payload;
      })
      .addCase(fetchApprovedSwapRequests.rejected, (state, action) => {
        state.loading.approvedSwaps = false;
        state.error = action.payload;
      });
  },
});

export const { clearUploadError } = adminSlice.actions;
export default adminSlice.reducer;