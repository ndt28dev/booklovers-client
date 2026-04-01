import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchCategories = createAsyncThunk(
  "chatCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/chat-categories`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CREATE
export const createCategory = createAsyncThunk(
  "chatCategory/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/chat-categories`,
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE
export const updateCategory = createAsyncThunk(
  "chatCategory/update",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/admin/chat-categories/${id}`,
        { name }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE
export const deleteCategory = createAsyncThunk(
  "chatCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/chat-categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  list: {
    data: [],
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
};

const chatCategorySlice = createSlice({
  name: "chatCategory",
  initialState,
  reducers: {
    // RESET từng block
    resetCreate: (state) => {
      state.create = initialState.create;
    },
    resetUpdate: (state) => {
      state.update = initialState.update;
    },
    resetDelete: (state) => {
      state.delete = initialState.delete;
    },

    // reset toàn bộ
    resetAll: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // ================= GET =================
      .addCase(fetchCategories.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createCategory.pending, (state) => {
        state.create.loading = true;
        state.create.success = false;
        state.create.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;

        // push vào list luôn cho realtime UI
        state.list.data.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateCategory.pending, (state) => {
        state.update.loading = true;
        state.update.success = false;
        state.update.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.update.loading = false;
        state.update.success = true;

        const index = state.list.data.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.list.data[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteCategory.pending, (state) => {
        state.delete.loading = true;
        state.delete.success = false;
        state.delete.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.delete.loading = false;
        state.delete.success = true;

        state.list.data = state.list.data.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload;
      });
  },
});

export const { resetCreate, resetUpdate, resetDelete, resetAll } =
  chatCategorySlice.actions;

export default chatCategorySlice.reducer;
