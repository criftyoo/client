import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";

// Async Thunks
export const reportIssues = createAsyncThunk(
  "reportIssues/reportIssues",
  async (issueData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/report-issues", issueData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getReportIssues = createAsyncThunk(
  "reportIssues/getReportIssues",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/report-issues");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteReportIssues = createAsyncThunk(
  "reportIssues/deleteReportIssues",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/report-issues/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateReportIssues = createAsyncThunk(
  "reportIssues/updateReportIssues",
  async ({ id, issueData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/report-issues/${id}`, issueData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  issues: [],
  loading: false,
  error: null,
};

const reportIssuesSlice = createSlice({
  name: "reportIssues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reportIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reportIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues.push(action.payload);
      })
      .addCase(reportIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReportIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(getReportIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReportIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReportIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.filter((issue) => issue._id !== action.payload);
      })
      .addCase(deleteReportIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReportIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReportIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = state.issues.map((issue) =>
          issue._id === action.payload._id ? action.payload : issue
        );
      })
      .addCase(updateReportIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportIssuesSlice.reducer;