import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchCategoriesWithSub = createAsyncThunk(
  "category/fetchCategoriesWithSub",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/menu`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi lấy danh mục"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesWithSub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithSub.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesWithSub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
