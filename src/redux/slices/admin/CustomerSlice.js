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
      });
  },
});

export default customerSlice.reducer;
