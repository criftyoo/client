import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";

// Async Thunks
export const createPreference = createAsyncThunk(
  "preferences/createPreference",
  async (preference, { rejectWithValue }) => {
    try {
      const { data } = await api.post("preferences/create", preference);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePreference = createAsyncThunk(
  "preferences/updatePreference",
  async ({ id, preference }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`preferences/update/${id}`, preference);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByUser = createAsyncThunk(
  "preferences/getPreferenceByUser",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/user/${user}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceById = createAsyncThunk(
  "preferences/getPreferenceById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/id/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePreference = createAsyncThunk(
  "preferences/deletePreference",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`preferences/delete/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllPreferences = createAsyncThunk(
  "preferences/getAllPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("preferences/all");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByWeek = createAsyncThunk(
  "preferences/getPreferenceByWeek",
  async (week, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/week/${week}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByShift = createAsyncThunk(
  "preferences/getPreferenceByShift",
  async (shift, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/shift/${shift}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByOffDay = createAsyncThunk(
  "preferences/getPreferenceByOffDay",
  async (offDay, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/offday/${offDay}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByWeekAndShift = createAsyncThunk(
  "preferences/getPreferenceByWeekAndShift",
  async ({ week, shift }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/week/${week}/shift/${shift}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByWeekAndOffDay = createAsyncThunk(
  "preferences/getPreferenceByWeekAndOffDay",
  async ({ week, offDay }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/week/${week}/offday/${offDay}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPreferenceByShiftAndOffDay = createAsyncThunk(
  "preferences/getPreferenceByShiftAndOffDay",
  async ({ shift, offDay }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`preferences/shift/${shift}/offday/${offDay}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    preferences: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetErrorAndMessage: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences.push(action.payload);
      })
      .addCase(createPreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = state.preferences.map((preference) =>
          preference._id === action.payload._id ? action.payload : preference
        );
      })
      .addCase(updatePreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceById.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = state.preferences.map((preference) =>
          preference._id === action.payload._id ? action.payload : preference
        );
      })
      .addCase(getPreferenceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = state.preferences.filter(
          (preference) => preference._id !== action.payload
        );
      })
      .addCase(deletePreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getAllPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByWeek.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByWeek.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByWeek.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByShift.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByOffDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByOffDay.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByOffDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByWeekAndShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByWeekAndShift.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByWeekAndShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByWeekAndOffDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByWeekAndOffDay.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByWeekAndOffDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPreferenceByShiftAndOffDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferenceByShiftAndOffDay.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(getPreferenceByShiftAndOffDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetErrorAndMessage } = preferencesSlice.actions;
export default preferencesSlice.reducer;