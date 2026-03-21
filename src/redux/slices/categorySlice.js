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

// CREATE category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (name, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/categories`, { name });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi tạo category"
      );
    }
  }
);

// UPDATE category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/categories/${id}`, { name });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi cập nhật category"
      );
    }
  }
);

// DELETE category (soft delete)
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/api/categories/${id}`);
      return { id }; // trả về id để frontend remove
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi xoá category"
      );
    }
  }
);

// ==================== SLICE ====================
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],

    // trạng thái fetch
    fetch: {
      loading: false,
      error: null,
    },
    // trạng thái create
    create: {
      loading: false,
      success: false,
      error: null,
    },
    // trạng thái update
    update: {
      loading: false,
      success: false,
      error: null,
    },
    // trạng thái delete
    delete: {
      loading: false,
      success: false,
      error: null,
    },
  },
  reducers: {
    resetCreate: (state) => {
      state.create = { loading: false, success: false, error: null };
    },
    resetUpdate: (state) => {
      state.update = { loading: false, success: false, error: null };
    },
    resetDelete: (state) => {
      state.delete = { loading: false, success: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== FETCH ====================
      .addCase(fetchCategoriesWithSub.pending, (state) => {
        state.fetch.loading = true;
        state.fetch.error = null;
      })
      .addCase(fetchCategoriesWithSub.fulfilled, (state, action) => {
        state.fetch.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesWithSub.rejected, (state, action) => {
        state.fetch.loading = false;
        state.fetch.error = action.payload;
      })

      // ==================== CREATE ====================
      .addCase(createCategory.pending, (state) => {
        state.create.loading = true;
        state.create.success = false;
        state.create.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.create.loading = false;
        state.create.success = false;
        state.create.error = action.payload;
      })

      // ==================== UPDATE ====================
      .addCase(updateCategory.pending, (state) => {
        state.update.loading = true;
        state.update.success = false;
        state.update.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.update.loading = false;
        state.update.success = true;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.update.loading = false;
        state.update.success = false;
        state.update.error = action.payload;
      })

      // ==================== DELETE ====================
      .addCase(deleteCategory.pending, (state) => {
        state.delete.loading = true;
        state.delete.success = false;
        state.delete.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.delete.loading = false;
        state.delete.success = true;
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.success = false;
        state.delete.error = action.payload;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete } = categorySlice.actions;
export default categorySlice.reducer;
