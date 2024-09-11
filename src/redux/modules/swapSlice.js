import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";

// Async Thunks
export const fetchAllSwaps = createAsyncThunk(
  "swaps/fetchAllSwaps",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/swap/swaps");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReceivedSwaps = createAsyncThunk(
  "swaps/fetchReceivedSwaps",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/swap/received/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSentSwaps = createAsyncThunk(
  "swaps/fetchSentSwaps",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/swap/sent/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApprovedSwaps = createAsyncThunk(
  "swaps/fetchApprovedSwaps",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/swap/approved-requests");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSwapRequest = createAsyncThunk(
  "swaps/createSwapRequest",
  async (swapData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/swap/request", swapData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSwapStatus = createAsyncThunk(
  "swaps/updateSwapStatus",
  async ({ swapId, statusData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/swap/update/${swapId}`, statusData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSwapRequest = createAsyncThunk(
  "swaps/cancelSwapRequest",
  async (swapId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/swap/cancel/${swapId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelAllSwaps = createAsyncThunk(
  "swaps/cancelAllSwaps",
  async ({ requesterId, recipientId }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/swap/cancel-all`, { requesterId, recipientId });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  swaps: {
    all: [],
    received: [],
    sent: [],
    approved: [],
  },
  loading: {
    allSwaps: false,
    receivedSwaps: false,
    sentSwaps: false,
    approvedSwaps: false,
    createSwap: false,
    updateSwap: false,
    cancelSwap: false,
    cancelAllSwaps: false,
  },
  error: null,
};

const swapSlice = createSlice({
  name: "swaps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSwaps.pending, (state) => {
        state.loading.allSwaps = true;
        state.error = null;
      })
      .addCase(fetchAllSwaps.fulfilled, (state, action) => {
        state.loading.allSwaps = false;
        state.swaps.all = action.payload;
      })
      .addCase(fetchAllSwaps.rejected, (state, action) => {
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
      .addCase(fetchApprovedSwaps.pending, (state) => {
        state.loading.approvedSwaps = true;
        state.error = null;
      })
      .addCase(fetchApprovedSwaps.fulfilled, (state, action) => {
        state.loading.approvedSwaps = false;
        state.swaps.approved = action.payload;
      })
      .addCase(fetchApprovedSwaps.rejected, (state, action) => {
        state.loading.approvedSwaps = false;
        state.error = action.payload;
      })
      .addCase(createSwapRequest.pending, (state) => {
        state.loading.createSwap = true;
        state.error = null;
      })
      .addCase(createSwapRequest.fulfilled, (state, action) => {
        state.loading.createSwap = false;
        state.swaps.sent.push(action.payload);
      })
      .addCase(createSwapRequest.rejected, (state, action) => {
        state.loading.createSwap = false;
        state.error = action.payload;
      })
      .addCase(updateSwapStatus.pending, (state) => {
        state.loading.updateSwap = true;
        state.error = null;
      })
      .addCase(updateSwapStatus.fulfilled, (state, action) => {
        state.loading.updateSwap = false;
        state.swaps.all = state.swaps.all.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
        state.swaps.received = state.swaps.received.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
        state.swaps.sent = state.swaps.sent.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
      })
      .addCase(updateSwapStatus.rejected, (state, action) => {
        state.loading.updateSwap = false;
        state.error = action.payload;
      })
      .addCase(cancelSwapRequest.pending, (state) => {
        state.loading.cancelSwap = true;
        state.error = null;
      })
      .addCase(cancelSwapRequest.fulfilled, (state, action) => {
        state.loading.cancelSwap = false;
        state.swaps.all = state.swaps.all.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
        state.swaps.received = state.swaps.received.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
        state.swaps.sent = state.swaps.sent.map((swap) =>
          swap._id === action.payload._id ? action.payload : swap
        );
      })
      .addCase(cancelSwapRequest.rejected, (state, action) => {
        state.loading.cancelSwap = false;
        state.error = action.payload;
      })
      .addCase(cancelAllSwaps.pending, (state) => {
        state.loading.cancelAllSwaps = true;
        state.error = null;
      })
      .addCase(cancelAllSwaps.fulfilled, (state, action) => {
        state.loading.cancelAllSwaps = false;
        state.swaps.all = state.swaps.all.map((swap) =>
          swap.requester === action.payload.requesterId ||
          swap.recipient === action.payload.recipientId
            ? { ...swap, status: "cancelled" }
            : swap
        );
        state.swaps.received = state.swaps.received.map((swap) =>
          swap.requester === action.payload.requesterId ||
          swap.recipient === action.payload.recipientId
            ? { ...swap, status: "cancelled" }
            : swap
        );
        state.swaps.sent = state.swaps.sent.map((swap) =>
          swap.requester === action.payload.requesterId ||
          swap.recipient === action.payload.recipientId
            ? { ...swap, status: "cancelled" }
            : swap
        );
      })
      .addCase(cancelAllSwaps.rejected, (state, action) => {
        state.loading.cancelAllSwaps = false;
        state.error = action.payload;
      });
  },
});

export default swapSlice.reducer;