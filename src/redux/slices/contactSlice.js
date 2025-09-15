import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

const initialState = {
  submitSuccess: false,
  submitError: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    resetContactStatus: (state) => {
      state.submitSuccess = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContact.fulfilled, (state, action) => {
        state.submitSuccess = true;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      });
  },
});

export const { resetContactStatus } = contactSlice.actions;
export default contactSlice.reducer;
