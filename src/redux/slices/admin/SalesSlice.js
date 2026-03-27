import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../../../config/api";
import axios from "axios";

// 👉 revenue
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

// 👉 order status
export const fetchOrderStatusOverview = createAsyncThunk(
  "sales/fetchOrderStatusOverview",
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

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    revenue: {
      data: null,
      loading: false,
      error: null,
    },
    orderStatusOverview: {
      data: null,
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
      });
  },
});

export default salesSlice.reducer;
