import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../../config/api";
import axios from "axios";

export const fetchRevenueStats = createAsyncThunk(
  "sales/fetchRevenueStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/revenue-overview`
      );

      return res.data.data; // 👈 thống nhất format
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchRevenueGrowth = createAsyncThunk(
  "sales/fetchRevenueGrowth",
  async (year = new Date().getFullYear(), thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/revenue-growth`,
        {
          params: { year },
        }
      );

      return res.data.data; // 👈 thống nhất luôn
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchOrderStatusOverview = createAsyncThunk(
  "sales/fetchOrderStatusOverview",
  async (year, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/statistics/order-status-overview`,
        {
          params: { year },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);

export const fetchRevenueByCategory = createAsyncThunk(
  "sales/fetchRevenueByCategory",
  async (year = new Date().getFullYear(), { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/revenue-by-category`,
        {
          params: { year },
        }
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTodayDashboard = createAsyncThunk(
  "sales/fetchTodayDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/revenue-of-the-day`
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTopOrdersByYear = createAsyncThunk(
  "sales/fetchTopOrdersByYear",
  async ({ year, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/top-orders-by-year`,
        {
          params: { year, limit },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    revenue: {
      data: null,
      loading: false,
      error: null,
    },
    revenueGrowth: {
      data: null,
      loading: false,
      error: null,
    },

    orderStatusOverview: {
      data: [],
      loading: false,
      error: null,
    },

    revenueByCategory: {
      data: [],
      loading: false,
      error: null,
    },
    todayDashboard: {
      data: null,
      loading: false,
      error: null,
    },

    topOrdersByYear: {
      data: [],
      loading: false,
      error: null,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ===== REVENUE =====
      .addCase(fetchRevenueStats.pending, (state) => {
        state.revenue.loading = true;
        state.revenue.error = null;
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.revenue.loading = false;
        state.revenue.data = action.payload;
      })
      .addCase(fetchRevenueStats.rejected, (state, action) => {
        state.revenue.loading = false;
        state.revenue.error = action.payload;
      })

      // ===== ORDER STATUS =====
      .addCase(fetchRevenueGrowth.pending, (state) => {
        state.revenueGrowth.loading = true;
        state.revenueGrowth.error = null;
      })
      .addCase(fetchRevenueGrowth.fulfilled, (state, action) => {
        state.revenueGrowth.loading = false;
        state.revenueGrowth.data = action.payload;
      })
      .addCase(fetchRevenueGrowth.rejected, (state, action) => {
        state.revenueGrowth.loading = false;
        state.revenueGrowth.error = action.payload;
      })

      // Order  status overview
      .addCase(fetchOrderStatusOverview.pending, (state) => {
        state.orderStatusOverview.loading = true;
        state.orderStatusOverview.error = null;
      })
      .addCase(fetchOrderStatusOverview.fulfilled, (state, action) => {
        state.orderStatusOverview.loading = false;
        state.orderStatusOverview.data = action.payload;
      })
      .addCase(fetchOrderStatusOverview.rejected, (state, action) => {
        state.orderStatusOverview.loading = false;
        state.orderStatusOverview.error = action.payload;
      })

      // ===== REVENUE BY CATEGORY =====
      .addCase(fetchRevenueByCategory.pending, (state) => {
        state.revenueByCategory.loading = true;
        state.revenueByCategory.error = null;
      })
      .addCase(fetchRevenueByCategory.fulfilled, (state, action) => {
        state.revenueByCategory.loading = false;
        state.revenueByCategory.data = action.payload;
      })
      .addCase(fetchRevenueByCategory.rejected, (state, action) => {
        state.revenueByCategory.loading = false;
        state.revenueByCategory.error = action.payload;
      })

      // ===== TODAY DASHBOARD =====
      .addCase(fetchTodayDashboard.pending, (state) => {
        state.todayDashboard.loading = true;
        state.todayDashboard.error = null;
      })
      .addCase(fetchTodayDashboard.fulfilled, (state, action) => {
        state.todayDashboard.loading = false;
        state.todayDashboard.data = action.payload;
      })
      .addCase(fetchTodayDashboard.rejected, (state, action) => {
        state.todayDashboard.loading = false;
        state.todayDashboard.error = action.payload;
      })

      // ===== TOP ORDERS BY YEAR =====
      .addCase(fetchTopOrdersByYear.pending, (state) => {
        state.topOrdersByYear.loading = true;
        state.topOrdersByYear.error = null;
      })
      .addCase(fetchTopOrdersByYear.fulfilled, (state, action) => {
        state.topOrdersByYear.loading = false;
        state.topOrdersByYear.data = action.payload.data;
      })
      .addCase(fetchTopOrdersByYear.rejected, (state, action) => {
        state.topOrdersByYear.loading = false;
        state.topOrdersByYear.error = action.payload;
      });
  },
});

export default salesSlice.reducer;
