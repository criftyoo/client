import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils";

// Async Thunks
export const fetchAllNews = createAsyncThunk(
  "news/fetchAllNews",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/news");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchNewsById = createAsyncThunk(
  "news/fetchNewsById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/news/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createNews = createAsyncThunk(
  "news/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/news", newsData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateNews = createAsyncThunk(
  "news/updateNews",
  async ({ id, newsData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/news/${id}`, newsData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteNews = createAsyncThunk(
  "news/deleteNews",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/news/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    singleNews: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleNews = action.payload;
      })
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.push(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.map((news) =>
          news._id === action.payload._id ? action.payload : news
        );
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter((news) => news._id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;