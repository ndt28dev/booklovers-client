import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../config/api";

export const fetchProductsOverview = createAsyncThunk(
  "productsOverview/fetchProductsOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/products-overview`
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products overview"
      );
    }
  }
);

export const fetchStockWarnings = createAsyncThunk(
  "stockWarnings/fetchStockWarnings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/stock-warnings`
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải thống kê tồn kho"
      );
    }
  }
);

export const fetchImportOverview = createAsyncThunk(
  "imports/fetchImportOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/statistics/import-overview`
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productsImportsSlice = createSlice({
  name: "productsImports",
  initialState: {
    productsOverview: {
      data: null,
      loading: false,
      error: null,
    },
    stockWarnings: {
      data: null,
      loading: false,
      error: null,
    },
    importOverview: {
      data: null,
      loading: false,
      error: null,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsOverview.pending, (state) => {
        state.productsOverview.loading = true;
        state.productsOverview.error = null;
      })
      .addCase(fetchProductsOverview.fulfilled, (state, action) => {
        state.productsOverview.loading = false;
        state.productsOverview.data = action.payload;
      })
      .addCase(fetchProductsOverview.rejected, (state, action) => {
        state.productsOverview.loading = false;
        state.productsOverview.error = action.payload;
      })

      .addCase(fetchStockWarnings.pending, (state) => {
        state.stockWarnings.loading = true;
        state.stockWarnings.error = null;
      })
      .addCase(fetchStockWarnings.fulfilled, (state, action) => {
        state.stockWarnings.loading = false;
        state.stockWarnings.data = action.payload;
      })
      .addCase(fetchStockWarnings.rejected, (state, action) => {
        state.stockWarnings.loading = false;
        state.stockWarnings.error = action.payload;
      })

      .addCase(fetchImportOverview.pending, (state) => {
        state.importOverview.loading = true;
      })
      .addCase(fetchImportOverview.fulfilled, (state, action) => {
        state.importOverview.loading = false;
        state.importOverview.data = action.payload;
      })
      .addCase(fetchImportOverview.rejected, (state, action) => {
        state.importOverview.loading = false;
        state.importOverview.error = action.payload;
      });
  },
});

export default productsImportsSlice.reducer;
