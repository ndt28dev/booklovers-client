import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchAllBook = createAsyncThunk(
  "book/fetchAllBook",
  async (
    {
      page = 1,
      limit = 5,
      sort = "",
      search = "",
      prices = [],
      categoryId = null,
      subcategoryId = null,
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        sort,
        search,
      });

      prices.forEach((price) => {
        params.append("prices", price);
      });

      if (categoryId) {
        params.append("categoryId", categoryId);
      }

      if (subcategoryId) {
        params.append("subcategoryId", subcategoryId);
      }

      const response = await axios.get(
        `${API_URL}/api/books?${params.toString()}`
      );

      return {
        books: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách sách"
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "book/fetchBookById",
  async (bookId, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/book/${bookId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy chi tiết sách"
      );
    }
  }
);

const initialState = {
  fetchBook: {
    listBook: [],
    pagination: null,
    error: null,
  },
  bookDetail: {
    book: null,
    bookDetail: null,
    bookImages: [],
    error: null,
  },
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBook.fulfilled, (state, action) => {
        state.fetchBook.listBook = action.payload.books;
        state.fetchBook.pagination = action.payload.pagination;
        state.fetchBook.error = null;
      })
      .addCase(fetchAllBook.rejected, (state, action) => {
        state.fetchBook.listBook = [];
        state.fetchBook.pagination = null;
        state.fetchBook.error = action.payload;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.bookDetail.book = action.payload.book;
        state.bookDetail.bookDetail = action.payload.bookDetail;
        state.bookDetail.bookImages = action.payload.bookImages;
        state.bookDetail.error = null;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.bookDetail.book = null;
        state.bookDetail.bookDetail = null;
        state.bookDetail.bookImages = [];
        state.bookDetail.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
