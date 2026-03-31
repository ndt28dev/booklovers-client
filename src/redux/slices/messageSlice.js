import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchChatUsers = createAsyncThunk(
  "chat/fetchChatUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/chat-users`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi lấy danh sách user");
    }
  }
);

export const fetchMessagesByUser = createAsyncThunk(
  "chat/fetchMessagesByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/messages/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi lấy tin nhắn");
    }
  }
);

const messageSlice = createSlice({
  name: "chat",
  initialState: {
    users: [],
    messages: [],
    selectedUser: null,
    loading: false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = []; // reset khi đổi user
    },

    // realtime message
    addMessageRealtime: (state, action) => {
      state.messages.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder

      // users
      .addCase(fetchChatUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      // messages
      .addCase(fetchMessagesByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessagesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      });
  },
});

export const { setSelectedUser, addMessageRealtime } = messageSlice.actions;

export default messageSlice.reducer;
