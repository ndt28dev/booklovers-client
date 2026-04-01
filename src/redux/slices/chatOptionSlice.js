import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchChatOptions = createAsyncThunk(
  "chat/fetchOptions",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/chat-options`, {
        params: { page, limit },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tải options");
    }
  }
);

export const fetchChatAnswer = createAsyncThunk(
  "chat/fetchAnswer",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/chat-options/answer/${id}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi lấy câu trả lời"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    listChat: {
      data: [],
      pagination: null,
      error: null,
    },

    createChat: {
      success: false,
      error: null,
    },
    updateChat: {
      loading: false,
      error: null,
    },
  },

  reducers: {
    resetCreateChat: (state) => {
      state.createChat.success = false;
      state.createChat.error = null;
    },

    resetUpdateChat: (state) => {
      state.updateChat.loading = false;
      state.updateChat.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchChatOptions.pending, (state) => {
        state.listChat.data = [];
        state.listChat.error = null;
      })
      .addCase(fetchChatOptions.fulfilled, (state, action) => {
        state.listChat.data = action.payload.data;
        state.listChat.pagination = action.payload.pagination;
      })
      .addCase(fetchChatOptions.rejected, (state, action) => {
        state.listChat.data = [];
        state.listChat.error = action.payload;
      })

      .addCase(fetchChatAnswer.pending, (state) => {
        state.updateChat.loading = true;
        state.updateChat.error = null;
      })
      .addCase(fetchChatAnswer.fulfilled, (state) => {
        state.updateChat.loading = false;
        state.updateChat.error = null;
      })
      .addCase(fetchChatAnswer.rejected, (state, action) => {
        state.updateChat.loading = false;
        state.updateChat.error = action.payload;
      });
  },
});

export const { resetCreateChat, resetUpdateChat } = chatSlice.actions;

export default chatSlice.reducer;
