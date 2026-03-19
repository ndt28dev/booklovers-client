import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

//
// ✅ CREATE SUPPLIER
//
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/api/suppliers`, data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo nhà cung cấp"
      );
    }
  }
);

//
// ✅ GET ALL SUPPLIERS
//
export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/suppliers`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy nhà cung cấp"
      );
    }
  }
);

//
// ✅ INITIAL STATE
//
const initialState = {
  suppliers: {
    data: [],
    loading: false,
    error: null,
  },

  createSupplier: {
    loading: false,
    success: false,
    error: null,
  },
};

//
// ✅ SLICE
//
const supplierSlice = createSlice({
  name: "supplier",
  initialState,

  reducers: {
    resetCreateSupplier: (state) => {
      state.createSupplier.success = false;
      state.createSupplier.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= CREATE =================
      .addCase(createSupplier.pending, (state) => {
        state.createSupplier.loading = true;
        state.createSupplier.error = null;
      })

      .addCase(createSupplier.fulfilled, (state) => {
        state.createSupplier.loading = false;
        state.createSupplier.success = true;
      })

      .addCase(createSupplier.rejected, (state, action) => {
        state.createSupplier.loading = false;
        state.createSupplier.error = action.payload;
      })

      // ================= FETCH =================
      .addCase(fetchSuppliers.pending, (state) => {
        state.suppliers.loading = true;
      })

      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.data = action.payload.data;
      })

      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = action.payload;
      });
  },
});

export const { resetCreateSupplier } = supplierSlice.actions;

export default supplierSlice.reducer;
