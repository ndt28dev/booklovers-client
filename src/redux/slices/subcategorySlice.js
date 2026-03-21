import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

// GET ALL
export const getAllSubcategories = createAsyncThunk(
  "subcategory/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/subcategories`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// CREATE
export const createSubcategory = createAsyncThunk(
  "subcategory/create",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/api/subcategories`, data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// UPDATE
export const updateSubcategory = createAsyncThunk(
  "subcategory/update",
  async ({ id, name }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/api/subcategories/${id}`, {
        name,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// DELETE
export const deleteSubcategory = createAsyncThunk(
  "subcategory/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/api/subcategories/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// ===================== Slice =====================
const subcategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    subcategories: [],
    // GET ALL
    getAll: {
      loading: false,
      error: null,
    },
    // CREATE
    create: {
      loading: false,
      error: null,
      success: false,
    },
    // UPDATE
    update: {
      loading: false,
      error: null,
      success: false,
    },
    // DELETE
    delete: {
      loading: false,
      error: null,
      success: false,
    },
  },
  reducers: {
    // Reset tất cả trạng thái
    resetSubcategoryState: (state) => {
      state.getAll = { loading: false, error: null };
      state.create = { loading: false, error: null, success: false };
      state.update = { loading: false, error: null, success: false };
      state.delete = { loading: false, error: null, success: false };
    },
    resetCreate: (state) => {
      state.create = { loading: false, error: null, success: false };
    },
    resetUpdate: (state) => {
      state.update = { loading: false, error: null, success: false };
    },
    resetDelete: (state) => {
      state.delete = { loading: false, error: null, success: false };
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET ALL =================
      .addCase(getAllSubcategories.pending, (state) => {
        state.getAll.loading = true;
        state.getAll.error = null;
      })
      .addCase(getAllSubcategories.fulfilled, (state, action) => {
        state.getAll.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(getAllSubcategories.rejected, (state, action) => {
        state.getAll.loading = false;
        state.getAll.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createSubcategory.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
        state.create.success = false;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;
        state.subcategories.push(action.payload);
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateSubcategory.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
        state.update.success = false;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.update.loading = false;
        state.update.success = true;
        const index = state.subcategories.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload;
        }
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteSubcategory.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
        state.delete.success = false;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.delete.loading = false;
        state.delete.success = true;
        state.subcategories = state.subcategories.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload;
      });
  },
});

export const { resetSubcategoryState, resetCreate, resetUpdate, resetDelete } =
  subcategorySlice.actions;

export default subcategorySlice.reducer;
