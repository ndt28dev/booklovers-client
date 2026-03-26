import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

// ================= REVIEW =================

// User create review
export const createReview = createAsyncThunk(
  "review/createReview",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/reviews`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// User delete review
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      await axios.delete(`${API_URL}/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Xoá review (admin)
export const adminDeleteReview = createAsyncThunk(
  "review/adminDeleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${id}/delete`);

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Ẩn/hiện review (admin)
export const adminToggleReviewVisibility = createAsyncThunk(
  "review/adminToggleReviewVisibility",
  async (id, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${id}/toggle-visibility`);

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all reviews (pagination)
export const getAllReviews = createAsyncThunk(
  "review/getAllReviews",
  async (
    { page = 1, limit = 10, rating, status, search } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit };

      if (rating) params.rating = rating;
      if (status) params.status = status;
      if (search) params.search = search;

      const res = await axios.get(`${API_URL}/api/reviews`, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get reviews by book
export const getReviewsByBookId = createAsyncThunk(
  "review/getReviewsByBookId",
  async ({ book_id, rating = null }, { rejectWithValue }) => {
    try {
      const params = {};
      if (rating !== null) params.rating = rating;
      const res = await axios.get(`${API_URL}/api/reviews/book/${book_id}`, {
        params,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  reviewList: { data: [], pagination: {}, loading: false, error: null },
  bookReviews: { data: [], loading: false, error: null },
  createReview: { loading: false, success: false, error: null },
  deleteReview: { loading: false, success: false, error: null },
  adminDeleteReview: { loading: false, success: false, error: null },
  adminToggleReviewVisibility: { loading: false, success: false, error: null },
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetCreateReview: (state) => {
      state.createReview = { loading: false, success: false, error: null };
    },
    resetDeleteReview: (state) => {
      state.deleteReview = { loading: false, success: false, error: null };
    },
    resetAdminDeleteReview: (state) => {
      state.adminDeleteReview = { loading: false, success: false, error: null };
    },
    resetAdminToggleReviewVisibility: (state) => {
      state.adminToggleReviewVisibility = {
        loading: false,
        success: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.reviewList.loading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.reviewList.loading = false;
        state.reviewList.data = action.payload.data;
        state.reviewList.pagination = action.payload.pagination;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.reviewList.loading = false;
        state.reviewList.error = action.payload;
      })

      .addCase(getReviewsByBookId.pending, (state) => {
        state.bookReviews.loading = true;
      })
      .addCase(getReviewsByBookId.fulfilled, (state, action) => {
        state.bookReviews.loading = false;
        state.bookReviews.data = action.payload;
      })
      .addCase(getReviewsByBookId.rejected, (state, action) => {
        state.bookReviews.loading = false;
        state.bookReviews.error = action.payload;
      })

      .addCase(createReview.pending, (state) => {
        state.createReview.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.createReview.loading = false;
        state.createReview.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createReview.loading = false;
        state.createReview.error = action.payload;
      })

      .addCase(deleteReview.pending, (state) => {
        state.deleteReview.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.deleteReview.loading = false;
        state.deleteReview.success = true;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleteReview.loading = false;
        state.deleteReview.error = action.payload;
      })

      .addCase(adminDeleteReview.pending, (state) => {
        state.adminDeleteReview.loading = true;
      })
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        state.adminDeleteReview.loading = false;
        state.adminDeleteReview.success = true;
      })
      .addCase(adminDeleteReview.rejected, (state, action) => {
        state.adminDeleteReview.loading = false;
        state.adminDeleteReview.error = action.payload;
      })

      .addCase(adminToggleReviewVisibility.pending, (state) => {
        state.adminToggleReviewVisibility.loading = true;
      })
      .addCase(adminToggleReviewVisibility.fulfilled, (state, action) => {
        state.adminToggleReviewVisibility.loading = false;
        state.adminToggleReviewVisibility.success = true;
      })
      .addCase(adminToggleReviewVisibility.rejected, (state, action) => {
        state.adminToggleReviewVisibility.loading = false;
        state.adminToggleReviewVisibility.error = action.payload;
      });
  },
});

export const {
  resetCreateReview,
  resetDeleteReview,
  resetAdminDeleteReview,
  resetAdminToggleReviewVisibility,
} = reviewSlice.actions;

export default reviewSlice.reducer;
