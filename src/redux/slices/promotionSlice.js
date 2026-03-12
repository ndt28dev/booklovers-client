import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchAllPromotion = createAsyncThunk(
  "promotion/fetchAllPromotion",
  async (
    { page = 1, limit = 10, discount_type = "", search = "" },
    thunkAPI
  ) => {
    try {
      let url = `${API_URL}/api/promotions?page=${page}&limit=${limit}`;

      if (discount_type) {
        url += `&discount_type=${discount_type}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await axios.get(url);

      return {
        promotions: res.data.data,
        pagination: res.data.pagination,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách khuyến mãi"
      );
    }
  }
);

// apply promotion
export const applyPromotion = createAsyncThunk(
  "promotion/applyPromotion",
  async (code, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/promotion/apply`, { code });
      return res.data.promotion;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi áp dụng mã");
    }
  }
);

// create promotion
export const createPromotion = createAsyncThunk(
  "promotion/createPromotion",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const res = await axios.post(`${API_URL}/api/promotion`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo mã");
    }
  }
);

// update promotion
export const updatePromotion = createAsyncThunk(
  "promotion/updatePromotion",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/promotion`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật mã");
    }
  }
);

// delete promotion
export const deletePromotion = createAsyncThunk(
  "promotion/deletePromotion",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/promotion/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi xóa mã");
    }
  }
);

const promotionSlice = createSlice({
  name: "promotion",
  initialState: {
    listState: {
      listPromotion: [],
      pagination: {},
      loading: false,
      error: null,
    },
    apply: {
      promotion: null,
      loading: false,
      error: null,
    },
    create: {
      loading: false,
      success: false,
      error: null,
    },
    update: {
      loading: false,
      success: false,
      error: null,
    },
    delete: {
      loading: false,
      success: false,
      error: null,
    },
  },

  reducers: {
    resetApplyPromotion: (state) => {
      state.apply = {
        promotion: null,
        loading: false,
        error: null,
      };
    },

    resetCreatePromotion: (state) => {
      state.create = {
        loading: false,
        success: false,
        error: null,
      };
    },

    resetUpdatePromotion: (state) => {
      state.update = {
        loading: false,
        success: false,
        error: null,
      };
    },

    resetDeletePromotion: (state) => {
      state.delete = {
        loading: false,
        success: false,
        error: null,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      // fetch promotions
      .addCase(fetchAllPromotion.pending, (state) => {
        state.listState.loading = true;
        state.listState.error = null;
      })

      .addCase(fetchAllPromotion.fulfilled, (state, action) => {
        state.listState.loading = false;
        state.listState.listPromotion = action.payload.promotions;
        state.listState.pagination = action.payload.pagination;
      })

      .addCase(fetchAllPromotion.rejected, (state, action) => {
        state.listState.loading = false;
        state.listState.error = action.payload;
      })

      // apply
      .addCase(applyPromotion.pending, (state) => {
        state.apply.loading = true;
        state.apply.error = null;
      })
      .addCase(applyPromotion.fulfilled, (state, action) => {
        state.apply.loading = false;
        state.apply.promotion = action.payload;
      })
      .addCase(applyPromotion.rejected, (state, action) => {
        state.apply.loading = false;
        state.apply.error = action.payload;
      })

      // create
      .addCase(createPromotion.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
      })
      .addCase(createPromotion.fulfilled, (state) => {
        state.create.loading = false;
        state.create.success = true;
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })

      // update
      .addCase(updatePromotion.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
      })
      .addCase(updatePromotion.fulfilled, (state) => {
        state.update.loading = false;
        state.update.success = true;
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload;
      })

      // delete
      .addCase(deletePromotion.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
      })
      .addCase(deletePromotion.fulfilled, (state) => {
        state.delete.loading = false;
        state.delete.success = true;
      })
      .addCase(deletePromotion.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload;
      });
  },
});

export const {
  resetApplyPromotion,
  resetCreatePromotion,
  resetUpdatePromotion,
  resetDeletePromotion,
} = promotionSlice.actions;

export default promotionSlice.reducer;
