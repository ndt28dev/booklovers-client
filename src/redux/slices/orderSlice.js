import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo đơn hàng thất bại"
      );
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi lấy đơn hàng");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại");
    try {
      const res = await axios.put(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    create: {
      loading: false,
      error: null,
      successMessage: null,
      orderId: null,
      orderCode: null,
    },
    list: {
      loading: false,
      error: null,
      orders: [],
    },
    cancel: {
      loading: false,
      error: null,
      success: null,
    },
  },
  reducers: {
    resetCreateOrderStatus: (state) => {
      state.create.error = null;
      state.create.successMessage = null;
      state.create.loading = false;
      state.create.orderId = null;
      state.create.orderCode = null;
    },
    resetOrderListStatus: (state) => {
      state.list.error = null;
      state.list.loading = false;
    },
    resetCancelStatus: (state) => {
      state.cancel.loading = false;
      state.cancel.error = null;
      state.cancel.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tạo đơn hàng
      .addCase(createOrder.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
        state.create.successMessage = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.orderId = action.payload.orderId;
        state.create.orderCode = action.payload.orderCode;
        state.create.successMessage = action.payload.message;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })

      // Lấy danh sách đơn hàng
      .addCase(getUserOrders.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      })
      // Huỷ đơn hàng
      .addCase(cancelOrder.pending, (state) => {
        state.cancel.loading = true;
        state.cancel.error = null;
        state.cancel.success = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancel.loading = false;
        state.cancel.success = "Huỷ đơn hàng thành công";
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancel.loading = false;
        state.cancel.error = action.payload || "Huỷ đơn hàng thất bại";
      });
  },
});

export const {
  resetCreateOrderStatus,
  resetCancelStatus,
  resetOrderListStatus,
} = orderSlice.actions;
export default orderSlice.reducer;
