import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

// CREATE CONTACT
export const createContact = createAsyncThunk(
  "contact/createContact",
  async (contactData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/contact`, contactData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi gửi liên hệ"
      );
    }
  }
);

// FETCH CONTACTS
export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/contacts?page=${page}&limit=${limit}`
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách liên hệ"
      );
    }
  }
);

const initialState = {
  listContact: {
    data: [],
    pagination: null,
    error: null,
  },

  createContact: {
    isSubmitting: false,
    success: false,
    error: null,
  },
};

const contactSlice = createSlice({
  name: "contact",
  initialState,

  reducers: {
    resetContactStatus: (state) => {
      state.createContact.success = false;
      state.createContact.error = null;
      state.createContact.isSubmitting = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE CONTACT
      .addCase(createContact.pending, (state) => {
        state.createContact.isSubmitting = true;
        state.createContact.error = null;
      })

      .addCase(createContact.fulfilled, (state) => {
        state.createContact.isSubmitting = false;
        state.createContact.success = true;
      })

      .addCase(createContact.rejected, (state, action) => {
        state.createContact.isSubmitting = false;
        state.createContact.error = action.payload;
      })

      // FETCH CONTACTS
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.listContact.pagination = action.payload.pagination;
        state.listContact.data = action.payload.data;
      })

      .addCase(fetchContacts.rejected, (state, action) => {
        state.listContact.error = action.payload;
      });
  },
});

export const { resetContactStatus } = contactSlice.actions;

export default contactSlice.reducer;
