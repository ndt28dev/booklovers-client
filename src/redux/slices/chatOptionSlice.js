import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

// =======================
// THUNKS
// =======================

// GET LIST
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

// GET ANSWER
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

// CREATE
export const createChatOption = createAsyncThunk(
  "chat/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/chat-options`,
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo");
    }
  }
);

// UPDATE
export const updateChatOption = createAsyncThunk(
  "chat/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/admin/chat-options/${id}`,
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật");
    }
  }
);

// DELETE (soft)
export const deleteChatOption = createAsyncThunk(
  "chat/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/chat-options/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi xoá");
    }
  }
);

export const fetchCategoriesWithOptions = createAsyncThunk(
  "chatUser/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/categories-with-options`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tải danh mục");
    }
  }
);

const initialState = {
  listChat: {
    data: [],
    pagination: null,
    loading: false,
    error: null,
  },

  createChat: {
    loading: false,
    success: false,
    error: null,
  },

  updateChat: {
    loading: false,
    success: false,
    error: null,
  },

  deleteChat: {
    loading: false,
    success: false,
    error: null,
  },

  answer: {
    data: null,
    loading: false,
    error: null,
  },

  categories: {
    data: [],
    loading: false,
    error: null,
  },

  chat: {
    messages: [
      {
        from: "bot",
        text: "Bạn cần hỗ trợ gì?",
      },
    ],
  },
};

const chatOptionSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetCreateChat: (state) => {
      state.createChat = initialState.createChat;
    },
    resetUpdateChat: (state) => {
      state.updateChat = initialState.updateChat;
    },
    resetDeleteChat: (state) => {
      state.deleteChat = initialState.deleteChat;
    },
    resetAnswer: (state) => {
      state.answer = initialState.answer;
    },
    addUserMessage: (state, action) => {
      state.chat.messages.push({
        from: "user",
        text: action.payload,
      });
    },

    addBotMessage: (state, action) => {
      state.chat.messages.push({
        from: "bot",
        text: action.payload,
      });
    },

    selectOption: (state, action) => {
      const { question, answer } = action.payload;

      // user hỏi
      state.chat.messages.push({
        from: "user",
        text: question,
      });

      // bot trả lời
      state.chat.messages.push({
        from: "bot",
        text: answer,
      });
    },

    resetChat: (state) => {
      state.chat.messages = [
        {
          from: "bot",
          text: "Bạn cần hỗ trợ gì?",
        },
      ];
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= GET LIST =================
      .addCase(fetchChatOptions.pending, (state) => {
        state.listChat.loading = true;
        state.listChat.error = null;
      })
      .addCase(fetchChatOptions.fulfilled, (state, action) => {
        state.listChat.loading = false;
        state.listChat.data = action.payload.data;
        state.listChat.pagination = action.payload.pagination;
      })
      .addCase(fetchChatOptions.rejected, (state, action) => {
        state.listChat.loading = false;
        state.listChat.error = action.payload;
      })

      // ================= GET ANSWER =================
      .addCase(fetchChatAnswer.pending, (state) => {
        state.answer.loading = true;
        state.answer.error = null;
      })
      .addCase(fetchChatAnswer.fulfilled, (state, action) => {
        state.answer.loading = false;
        state.answer.data = action.payload;
      })
      .addCase(fetchChatAnswer.rejected, (state, action) => {
        state.answer.loading = false;
        state.answer.error = action.payload;
      })

      // ================= CREATE =================
      .addCase(createChatOption.pending, (state) => {
        state.createChat.loading = true;
        state.createChat.success = false;
        state.createChat.error = null;
      })
      .addCase(createChatOption.fulfilled, (state, action) => {
        state.createChat.loading = false;
        state.createChat.success = true;

        // push lên đầu list
        state.listChat.data.unshift(action.payload);
      })
      .addCase(createChatOption.rejected, (state, action) => {
        state.createChat.loading = false;
        state.createChat.error = action.payload;
      })

      // ================= UPDATE =================
      .addCase(updateChatOption.pending, (state) => {
        state.updateChat.loading = true;
        state.updateChat.success = false;
        state.updateChat.error = null;
      })
      .addCase(updateChatOption.fulfilled, (state, action) => {
        state.updateChat.loading = false;
        state.updateChat.success = true;

        const index = state.listChat.data.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.listChat.data[index] = {
            ...state.listChat.data[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateChatOption.rejected, (state, action) => {
        state.updateChat.loading = false;
        state.updateChat.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteChatOption.pending, (state) => {
        state.deleteChat.loading = true;
        state.deleteChat.success = false;
        state.deleteChat.error = null;
      })
      .addCase(deleteChatOption.fulfilled, (state, action) => {
        state.deleteChat.loading = false;
        state.deleteChat.success = true;

        // remove khỏi list
        state.listChat.data = state.listChat.data.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteChatOption.rejected, (state, action) => {
        state.deleteChat.loading = false;
        state.deleteChat.error = action.payload;
      })

      .addCase(fetchCategoriesWithOptions.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchCategoriesWithOptions.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload;
      })
      .addCase(fetchCategoriesWithOptions.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      });
  },
});

export const {
  resetCreateChat,
  resetUpdateChat,
  resetDeleteChat,
  resetAnswer,
  addUserMessage,
  resetChat,
  selectOption,
  addBotMessage,
} = chatOptionSlice.actions;

export default chatOptionSlice.reducer;
