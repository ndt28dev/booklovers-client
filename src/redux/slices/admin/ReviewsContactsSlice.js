import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../config/api";

export const fetchFeedbackStats = createAsyncThunk(
  "feedback/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/contact-overview`
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const fetchReviewStats = createAsyncThunk(
  "reviews/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/review-overview`
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTopBooksMostReviews = createAsyncThunk(
  "reviews/fetchTopBooksMostReviews",
  async ({ limit = 10, year }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/top-books-reviews`,
        {
          params: {
            limit,
            year,
          },
        }
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const reviewsContactsSlice = createSlice({
  name: "feedbackStats",
  initialState: {
    reviewOverview: {
      data: null,
      loading: false,
      error: null,
    },

    reviewStats: {
      data: null,
      loading: false,
      error: null,
    },

    topBooksMostReviews: {
      data: null,
      loading: false,
      error: null,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbackStats.pending, (state) => {
        state.reviewOverview.loading = true;
        state.reviewOverview.error = null;
      })
      .addCase(fetchFeedbackStats.fulfilled, (state, action) => {
        state.reviewOverview.loading = false;
        state.reviewOverview.data = action.payload;
      })
      .addCase(fetchFeedbackStats.rejected, (state, action) => {
        state.reviewOverview.loading = false;
        state.reviewOverview.error = action.payload || "Something went wrong";
      })

      .addCase(fetchReviewStats.pending, (state) => {
        state.reviewStats.loading = true;
        state.reviewStats.error = null;
      })
      .addCase(fetchReviewStats.fulfilled, (state, action) => {
        state.reviewStats.loading = false;
        state.reviewStats.data = action.payload;
      })
      .addCase(fetchReviewStats.rejected, (state, action) => {
        state.reviewStats.loading = false;
        state.reviewStats.error = action.payload || "Something went wrong";
      })

      .addCase(fetchTopBooksMostReviews.pending, (state) => {
        state.topBooksMostReviews.loading = true;
        state.topBooksMostReviews.error = null;
      })
      .addCase(fetchTopBooksMostReviews.fulfilled, (state, action) => {
        state.topBooksMostReviews.loading = false;
        state.topBooksMostReviews.data = action.payload;
      })
      .addCase(fetchTopBooksMostReviews.rejected, (state, action) => {
        state.topBooksMostReviews.loading = false;
        state.topBooksMostReviews.error =
          action.payload || "Something went wrong";
      });
  },
});

export default reviewsContactsSlice.reducer;
