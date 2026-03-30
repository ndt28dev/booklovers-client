import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../config/api";

export const fetchCustomerOverview = createAsyncThunk(
  "customer/fetchCustomerOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/customer-overview`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCustomerCLV = createAsyncThunk(
  "customer/fetchCustomerCLV",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/customer-clv`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchTopCustomersByYear = createAsyncThunk(
  "sales/fetchTopCustomersByYear",
  async ({ year, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/top-customers-by-year`,
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

export const fetchCustomerByHour = createAsyncThunk(
  "customer/fetchCustomerByHour",
  async (year, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/statistics/customer-by-hour`,
        {
          params: { year },
        }
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    overview: {
      data: null,
      loading: false,
      error: null,
    },
    clv: {
      data: null,
      loading: false,
      error: null,
    },
    topCustomersByYear: {
      data: [],
      loading: false,
      error: null,
    },
    customerByHour: {
      data: [],
      loading: false,
      error: null,
    },
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOverview.pending, (state) => {
        state.overview.loading = true;
      })
      .addCase(fetchCustomerOverview.fulfilled, (state, action) => {
        state.overview.loading = false;
        state.overview.data = action.payload;
      })
      .addCase(fetchCustomerOverview.rejected, (state, action) => {
        state.overview.loading = false;
        state.overview.error = action.payload;
      })

      .addCase(fetchCustomerCLV.pending, (state) => {
        state.clv.loading = true;
      })
      .addCase(fetchCustomerCLV.fulfilled, (state, action) => {
        state.clv.loading = false;
        state.clv.data = action.payload;
      })
      .addCase(fetchCustomerCLV.rejected, (state, action) => {
        state.clv.loading = false;
        state.clv.error = action.payload;
      })

      // ===== TOP CUSTOMERS BY YEAR =====
      .addCase(fetchTopCustomersByYear.pending, (state) => {
        state.topCustomersByYear.loading = true;
        state.topCustomersByYear.error = null;
      })
      .addCase(fetchTopCustomersByYear.fulfilled, (state, action) => {
        state.topCustomersByYear.loading = false;
        state.topCustomersByYear.data = action.payload.data;
      })
      .addCase(fetchTopCustomersByYear.rejected, (state, action) => {
        state.topCustomersByYear.loading = false;
        state.topCustomersByYear.error = action.payload;
      })

      // ===== CUSTOMER BY HOUR =====
      .addCase(fetchCustomerByHour.pending, (state) => {
        state.customerByHour.loading = true;
        state.customerByHour.error = null;
      })
      .addCase(fetchCustomerByHour.fulfilled, (state, action) => {
        state.customerByHour.loading = false;
        state.customerByHour.data = action.payload;
      })
      .addCase(fetchCustomerByHour.rejected, (state, action) => {
        state.customerByHour.loading = false;
        state.customerByHour.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
