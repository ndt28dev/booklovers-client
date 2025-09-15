import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../config/api";

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      paymentMethod = "",
      status = "",
      priceFilter = "",
      fromDate,
      toDate,
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        paymentMethod,
        status,
        priceFilter,
        fromDate: fromDate || "",
        toDate: toDate || "",
      });
      const res = await axios.get(`${API_URL}/api/admin/orders/all?${params}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/admin/orders/update-status/${orderId}`,
        { status }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  listOrders: {
    list: [],
    loading: false,
    error: null,
  },
  updateStatus: {
    loading: false,
    success: false,
    error: null,
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetUpdateStatus(state) {
      state.updateStatus = {
        loading: false,
        success: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.listOrders.loading = true;
        state.listOrders.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.listOrders.loading = false;
        state.listOrders.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.listOrders.loading = false;
        state.listOrders.error = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus.loading = true;
        state.updateStatus.success = false;
        state.updateStatus.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.updateStatus.loading = false;
        state.updateStatus.success = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus.loading = false;
        state.updateStatus.error = action.payload;
      });
  },
});

export const { resetUpdateStatus } = orderSlice.actions;

export default orderSlice.reducer;
