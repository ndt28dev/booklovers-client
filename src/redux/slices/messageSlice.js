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
    },

    // realtime message
    addMessageRealtime: (state, action) => {
      const msg = action.payload;
      const userId = Number(msg.user_id);

      const isActiveChat = Number(state.selectedUser) === userId;

      // chỉ push message nếu đang mở đúng user
      if (isActiveChat) {
        state.messages.push(msg);
      }

      const index = state.users.findIndex((u) => Number(u.id) === userId);

      const isFromUser = msg.sender_type?.trim().toLowerCase() === "user";

      const shouldIncrease = isFromUser && !isActiveChat;

      if (index !== -1) {
        const user = state.users[index];

        state.users[index] = {
          ...user,
          last_message: msg.message,
          last_sender: msg.sender_type,
          unread_count: shouldIncrease
            ? (user.unread_count || 0) + 1
            : user.unread_count || 0,
          last_time: msg.created_at || new Date().toISOString(),
        };

        // move to top
        const [moved] = state.users.splice(index, 1);
        state.users.unshift(moved);
      } else {
        state.users.unshift({
          id: userId,
          fullname: msg.fullname,
          avatar: msg.avatar,
          last_message: msg.message,
          last_sender: msg.sender_type,
          unread_count: shouldIncrease ? 1 : 0,
          last_time: msg.created_at || new Date().toISOString(),
        });
      }
    },

    markUserSeen: (state, action) => {
      const userId = action.payload;

      const index = state.users.findIndex((u) => u.id === userId);

      if (index !== -1) {
        state.users[index].unread_count = 0;
      }
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

export const { setSelectedUser, addMessageRealtime, markUserSeen } =
  messageSlice.actions;

export default messageSlice.reducer;
