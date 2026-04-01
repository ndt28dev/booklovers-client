import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (user_id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/notifications/${user_id}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi lấy thông báo");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (user_id, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/api/admin/notifications/read-all/${user_id}`);
      return user_id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi cập nhật");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    loading: false,
  },

  reducers: {
    addNotificationRealtime: (state, action) => {
      state.list.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      // MARK ALL
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({
          ...n,
          is_read: 1,
        }));
      });
  },
});

export const { addNotificationRealtime } = notificationSlice.actions;
export default notificationSlice.reducer;
