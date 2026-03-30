import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

//
// ✅ CREATE IMPORT
//
export const createImport = createAsyncThunk(
  "import/createImport",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/api/imports`, data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi nhập hàng"
      );
    }
  }
);

//
// ✅ GET ALL IMPORTS
//
export const fetchImports = createAsyncThunk(
  "import/fetchImports",
  async (
    { page = 1, limit = 10, supplierId, startDate, endDate } = {},
    thunkAPI
  ) => {
    try {
      const params = {
        page,
        limit,
        ...(supplierId && { supplierId }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      const res = await axios.get(`${API_URL}/api/imports`, { params });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách nhập hàng"
      );
    }
  }
);

//
// ✅ GET IMPORT DETAIL
//
export const fetchImportDetail = createAsyncThunk(
  "import/fetchImportDetail",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/imports/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy chi tiết phiếu nhập"
      );
    }
  }
);

//
// ✅ INITIAL STATE
//
const initialState = {
  imports: {
    data: [],
    loading: false,
    error: null,
  },

  importDetail: {
    data: null,
    pagination: null,
    loading: false,
    error: null,
  },

  createImport: {
    loading: false,
    success: false,
    error: null,
  },
};

//
// ✅ SLICE
//
const importSlice = createSlice({
  name: "import",
  initialState,

  reducers: {
    resetCreateImport: (state) => {
      state.createImport.success = false;
      state.createImport.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= CREATE IMPORT =================
      .addCase(createImport.pending, (state) => {
        state.createImport.loading = true;
        state.createImport.error = null;
      })

      .addCase(createImport.fulfilled, (state) => {
        state.createImport.loading = false;
        state.createImport.success = true;
      })

      .addCase(createImport.rejected, (state, action) => {
        state.createImport.loading = false;
        state.createImport.error = action.payload;
      })

      // ================= FETCH IMPORTS =================
      .addCase(fetchImports.pending, (state) => {
        state.imports.loading = true;
      })

      .addCase(fetchImports.fulfilled, (state, action) => {
        state.imports.loading = false;
        state.imports.data = action.payload.data;
        state.imports.pagination = action.payload.pagination;
      })

      .addCase(fetchImports.rejected, (state, action) => {
        state.imports.loading = false;
        state.imports.error = action.payload;
      })

      // ================= FETCH IMPORT DETAIL =================
      .addCase(fetchImportDetail.pending, (state) => {
        state.importDetail.loading = true;
      })

      .addCase(fetchImportDetail.fulfilled, (state, action) => {
        state.importDetail.loading = false;
        state.importDetail.data = action.payload.data;
      })

      .addCase(fetchImportDetail.rejected, (state, action) => {
        state.importDetail.loading = false;
        state.importDetail.error = action.payload;
      });
  },
});

export const { resetCreateImport } = importSlice.actions;

export default importSlice.reducer;
