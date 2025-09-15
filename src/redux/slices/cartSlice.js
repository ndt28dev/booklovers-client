import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchCartFromServer = createAsyncThunk(
  "cart/fetchCartFromServer",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue("Lỗi khi lấy giỏ hàng");
    }
  }
);

export const addItemToCartAsync = createAsyncThunk(
  "cart/addItemToCartAsync",
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/cart/add`,
        { bookId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { bookId, quantity };
    } catch (err) {
      return rejectWithValue("Lỗi khi thêm sản phẩm vào giỏ");
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/cart/item/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi cập nhật số lượng"
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/api/cart/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return itemId; // return để reducer filter ra khỏi state
    } catch (err) {
      return rejectWithValue("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  }
);

export const applyPromotionCode = createAsyncThunk(
  "cart/applyPromotionCode",
  async (code, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/promotion/apply`, {
        code,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Mã khuyến mãi không hợp lệ"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cartItems: [],
      cart_id: null,
      loading: false,
      error: null,
    },
    upcart: {
      error: null,
    },
    applyPro: {
      loading: false,
      promotion: null,
      error: null,
    },
  },
  reducers: {
    resetApplyPro: (state, action) => {
      state.applyPro.loading = false;
      state.applyPro.promotion = null;
      state.applyPro.error = null;
    },

    resetCartLogout: (state) => {
      state.cart.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromServer.pending, (state) => {
        state.cart.loading = true;
        state.cart.error = null;
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.cart.cartItems = action.payload.items;
        state.cart.cart_id = action.payload.cart.id;
        state.cart.loading = false;
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.cart.loading = false;
        state.cart.error = action.payload;
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        const { bookId, quantity } = action.payload;
        const existing = state.cart.cartItems.find(
          (item) => item.bookId === bookId
        );
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.cart.cartItems.push({ bookId, quantity });
        }
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const { itemId, quantity } = action.meta.arg;
        const item = state.cart.cartItems.find(
          (item) => item.cart_item_id === parseInt(itemId)
        );
        if (item) {
          item.quantity = quantity;
        }
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.cart.cartItems = state.cart.cartItems.filter(
          (item) => item.cart_item_id !== itemId
        );
      })
      .addCase(applyPromotionCode.pending, (state) => {
        state.applyPro.loading = true;
        state.applyPro.error = null;
      })
      .addCase(applyPromotionCode.fulfilled, (state, action) => {
        state.applyPro.loading = false;
        state.applyPro.promotion = action.payload.promotion;
      })
      .addCase(applyPromotionCode.rejected, (state, action) => {
        state.applyPro.loading = false;
        state.applyPro.promotion = null;
        state.applyPro.error = action.payload;
      });
  },
});

export const { resetApplyPro, resetCartLogout } = cartSlice.actions;

export default cartSlice.reducer;
