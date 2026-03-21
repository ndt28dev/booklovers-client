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
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/suppliers?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy nhà cung cấp"
      );
    }
  }
);

export const fetchSuppliersAll = createAsyncThunk(
  "supplier/fetchSuppliersAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/suppliers/all`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy tất cả nhà cung cấp"
      );
    }
  }
);

//
// ✅ UPDATE SUPPLIER
//
export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/api/suppliers/${id}`, data);
      return { id, ...res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật"
      );
    }
  }
);

//
// ✅ DELETE SUPPLIER (SOFT DELETE)
//
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/api/suppliers/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi xoá"
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

  suppliersAll: {
    data: [],
    loading: false,
    error: null,
  },

  createSupplier: {
    loading: false,
    success: false,
    error: null,
  },

  updateSupplier: {
    loading: false,
    success: false,
    error: null,
  },

  deleteSupplier: {
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
      state.createSupplier = {
        loading: false,
        success: false,
        error: null,
      };
    },

    resetUpdateSupplier: (state) => {
      state.updateSupplier = {
        loading: false,
        success: false,
        error: null,
      };
    },

    resetDeleteSupplier: (state) => {
      state.deleteSupplier = {
        loading: false,
        success: false,
        error: null,
      };
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
        state.suppliers.pagination = action.payload.pagination;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = action.payload;
      })

      // ================= FETCH ALL =================
      .addCase(fetchSuppliersAll.pending, (state) => {
        state.suppliersAll.loading = true;
        state.suppliersAll.error = null;
      })
      .addCase(fetchSuppliersAll.fulfilled, (state, action) => {
        state.suppliersAll.loading = false;
        state.suppliersAll.data = action.payload.data;
      })
      .addCase(fetchSuppliersAll.rejected, (state, action) => {
        state.suppliersAll.loading = false;
        state.suppliersAll.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateSupplier.pending, (state) => {
        state.updateSupplier.loading = true;
        state.updateSupplier.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state) => {
        state.updateSupplier.loading = false;
        state.updateSupplier.success = true;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.updateSupplier.loading = false;
        state.updateSupplier.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteSupplier.pending, (state) => {
        state.deleteSupplier.loading = true;
        state.deleteSupplier.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.deleteSupplier.loading = false;
        state.deleteSupplier.success = true;

        // 🔥 Xoá luôn khỏi UI (không cần fetch lại)
        state.suppliers.data = state.suppliers.data.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.deleteSupplier.loading = false;
        state.deleteSupplier.error = action.payload;
      });
  },
});

export const { resetCreateSupplier, resetUpdateSupplier, resetDeleteSupplier } =
  supplierSlice.actions;

export default supplierSlice.reducer;
