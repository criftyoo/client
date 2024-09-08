import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";

// Async Thunks
export const fetchLeaveRequests = createAsyncThunk(
  "leaves/fetchLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/leaves/all");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchLeaveRequestsByUserId = createAsyncThunk(
  "leaves/fetchLeaveRequestsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/leaves/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createLeaveRequest = createAsyncThunk(
  "leaves/createLeaveRequest",
  async (leaveRequest, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/leaves/create", leaveRequest);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateLeaveRequest = createAsyncThunk(
  "leaves/updateLeaveRequest",
  async ({ id, updatedRequest }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/leaves/update`, { id, ...updatedRequest });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteLeaveRequest = createAsyncThunk(
  "leaves/deleteLeaveRequest",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leaves/delete`, { data: { id } });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const leavesSlice = createSlice({
  name: "leaves",
  initialState: {
    leaveRequests: [],
    status: 'idle',
    error: null,
    message: null,
  },
  reducers: {
    resetErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leave Requests
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests = action.payload;
        state.message = 'Leave requests fetched successfully';
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.message = 'Failed to fetch leave requests';
      })
      // Fetch Leave Requests By User Id
      .addCase(fetchLeaveRequestsByUserId.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(fetchLeaveRequestsByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests = action.payload;
        state.message = 'Leave requests fetched successfully';
      })
      .addCase(fetchLeaveRequestsByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.message = 'Failed to fetch leave requests';
      })
      // Create Leave Request
      .addCase(createLeaveRequest.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests.push(action.payload);
        state.message = 'Leave request created successfully';
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.message = 'Failed to create leave request';
      })
      // Update Leave Request
      .addCase(updateLeaveRequest.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests = state.leaveRequests.map((request) =>
          request._id === action.payload._id ? action.payload : request
        );
        state.message = 'Leave request updated successfully';
      })
      .addCase(updateLeaveRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.message = 'Failed to update leave request';
      })
      // Delete Leave Request
      .addCase(deleteLeaveRequest.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests = state.leaveRequests.filter(
          (request) => request._id !== action.payload
        );
        state.message = 'Leave request deleted successfully';
      })
      .addCase(deleteLeaveRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.message = 'Failed to delete leave request';
      });
  },
});

export const { resetErrorAndMessage } = leavesSlice.actions;
export default leavesSlice.reducer;