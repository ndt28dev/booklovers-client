import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../config/api";

export const fetchStatistics = createAsyncThunk(
  "statistics/fetch",
  async ({ startDate, endDate }, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/statistics`, {
        params: {
          startDate,
          endDate,
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchStatisticsHeader = createAsyncThunk(
  "statisticsheader/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/statisticsheader`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  "statistics/fetchMonthlyRevenue",
  async (year, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/monthly-revenue`,
        {
          params: { year },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchTopOrders = createAsyncThunk(
  "statistics/fetchTopOrders",
  async ({ startDate, endDate, sortType = "top" }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/top-orders`,
        {
          params: { startDate, endDate, sortType },
        }
      );
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const fetchTopBuyers = createAsyncThunk(
  "topBuyers/fetchTopBuyers",
  async ({ month, year }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/statistics/top-buyers`,
        {
          params: { month, year },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrderStatusByMonth = createAsyncThunk(
  "statistics/fetchOrderStatusByMonth",
  async ({ year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/statistics/month-status`,
        {
          params: { year },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);

const statisticSlice = createSlice({
  name: "statistics",
  initialState: {
    statistics: {
      loading: false,
      data: null,
      error: null,
    },
    statisticsheader: {
      loading: false,
      data: null,
      error: null,
    },
    orderDetail: {
      loading: false,
      currentOrder: null,
      error: null,
    },
    monthlyRevenue: {
      loading: false,
      data: null,
      error: null,
    },
    toporder: {
      topOrders: [],
      loading: false,
      error: null,
    },
    topBuyer: {
      loading: false,
      data: null,
      error: null,
    },

    statusByMonth: {
      orderStatusByMonth: [],
      loading: false,
      error: null,
    },
  },
  reducers: {
    resetStatistics: (state) => {
      state.statistics = {
        loading: false,
        data: null,
        error: null,
      };
    },
    resetCurrentOrder: (state) => {
      state.orderDetail = {
        loading: false,
        currentOrder: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Statistics
      .addCase(fetchStatistics.pending, (state) => {
        state.statistics.loading = true;
        state.statistics.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics.loading = false;
        state.statistics.data = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.statistics.loading = false;
        state.statistics.error = action.payload;
      })

      // StatisticsHeader
      .addCase(fetchStatisticsHeader.pending, (state) => {
        state.statisticsheader.loading = true;
        state.statisticsheader.error = null;
      })
      .addCase(fetchStatisticsHeader.fulfilled, (state, action) => {
        state.statisticsheader.loading = false;
        state.statisticsheader.data = action.payload;
      })
      .addCase(fetchStatisticsHeader.rejected, (state, action) => {
        state.statisticsheader.loading = false;
        state.statisticsheader.error = action.payload;
      })

      // Order detail
      .addCase(fetchOrderById.pending, (state) => {
        state.orderDetail.loading = true;
        state.orderDetail.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderDetail.loading = false;
        state.orderDetail.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderDetail.loading = false;
        state.orderDetail.error = action.payload;
      })
      // Monthly Revenue
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.monthlyRevenue.loading = true;
        state.monthlyRevenue.error = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.monthlyRevenue.loading = false;
        state.monthlyRevenue.data = action.payload;
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.monthlyRevenue.loading = false;
        state.monthlyRevenue.error = action.payload;
      })

      // top orders
      .addCase(fetchTopOrders.pending, (state) => {
        state.toporder.loading = true;
        state.toporder.error = null;
      })
      .addCase(fetchTopOrders.fulfilled, (state, action) => {
        state.toporder.loading = false;
        state.toporder.topOrders = action.payload;
      })
      .addCase(fetchTopOrders.rejected, (state, action) => {
        state.toporder.loading = false;
        state.toporder.error = action.payload;
      })
      // top user
      .addCase(fetchTopBuyers.pending, (state) => {
        state.topBuyer.loading = true;
        state.topBuyer.error = null;
      })
      .addCase(fetchTopBuyers.fulfilled, (state, action) => {
        state.topBuyer.loading = false;
        state.topBuyer.data = action.payload;
      })
      .addCase(fetchTopBuyers.rejected, (state, action) => {
        state.topBuyer.loading = false;
        state.topBuyer.error = action.payload;
      })
      // Order status by month
      .addCase(fetchOrderStatusByMonth.pending, (state) => {
        state.statusByMonth.loading = true;
        state.statusByMonth.error = null;
      })
      .addCase(fetchOrderStatusByMonth.fulfilled, (state, action) => {
        state.statusByMonth.loading = false;
        state.statusByMonth.orderStatusByMonth = action.payload;
      })
      .addCase(fetchOrderStatusByMonth.rejected, (state, action) => {
        state.statusByMonth.loading = false;
        state.statusByMonth.error = action.payload || "Lỗi không xác định";
      });
  },
});

export const { resetStatistics, resetCurrentOrder } = statisticSlice.actions;
export default statisticSlice.reducer;
