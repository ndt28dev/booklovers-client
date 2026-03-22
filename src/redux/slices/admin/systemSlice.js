import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../../config/api";

// Lấy thông tin hệ thống
export const fetchSystemSettings = createAsyncThunk(
  "system/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/settings-system`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Lỗi server" });
    }
  }
);

// Cập nhật thông tin hệ thống
export const updateSystemSettings = createAsyncThunk(
  "system/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/settings-system`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Lỗi server" });
    }
  }
);

const systemSlice = createSlice({
  name: "system",
  initialState: {
    settings: null,
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchSystemSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSystemSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload;
    });
    builder.addCase(fetchSystemSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // Update
    builder.addCase(updateSystemSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
    });
    builder.addCase(updateSystemSettings.fulfilled, (state) => {
      state.loading = false;
      state.updateSuccess = true;
    });
    builder.addCase(updateSystemSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      state.updateSuccess = false;
    });
  },
});

export const { clearUpdateSuccess } = systemSlice.actions;
export default systemSlice.reducer;
