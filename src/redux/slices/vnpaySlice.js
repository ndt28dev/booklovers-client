import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const createVnpayPayment = createAsyncThunk(
  "vnpay/createPayment",
  async ({ amount, orderId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/vnpay/create_payment_url`, {
        amount,
        orderId,
      });
      return res.data.paymentUrl;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tạo thanh toán"
      );
    }
  }
);

const vnpaySlice = createSlice({
  name: "vnpay",
  initialState: {
    paymentUrl: "",
    loading: false,
    error: null,
  },
  reducers: {
    resetVnpay: (state) => {
      state.paymentUrl = "";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVnpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentUrl = "";
      })
      .addCase(createVnpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload;
      })
      .addCase(createVnpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVnpay } = vnpaySlice.actions;
export default vnpaySlice.reducer;
