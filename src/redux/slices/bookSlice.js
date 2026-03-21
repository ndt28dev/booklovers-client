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

// GET ALL BOOKS (NO PAGING)
export const getAllBooksNoPaging = createAsyncThunk(
  "books/getAllNoPaging",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/books/all`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Lỗi khi lấy danh sách sách"
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

export const createBook = createAsyncThunk(
  "book/createBook",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/book`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo sách"
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/api/book`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật sách"
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/book/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Delete book failed" }
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
  fetchBookAllNoPaging: {
    listBookAllNoPaging: [],
    error: null,
  },
  bookDetail: {
    book: null,
    bookDetail: null,
    bookImages: [],
    error: null,
  },
  createBook: {
    isLoading: false,
    success: false,
    error: null,
  },
  updateBook: {
    isLoading: false,
    error: null,
    success: false,
  },
  deleteBook: {
    isLoading: false,
    error: null,
    success: false,
  },
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    resetCreateBookStatus: (state) => {
      state.createBook = {
        isLoading: false,
        error: null,
        success: false,
      };
    },
    resetUpdateBookStatus: (state) => {
      state.updateBook = {
        isLoading: false,
        error: null,
        success: false,
      };
    },
    resetDeleteBookStatus: (state) => {
      state.deleteBook = {
        isLoading: false,
        error: null,
        success: false,
      };
    },
  },
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
      .addCase(getAllBooksNoPaging.fulfilled, (state, action) => {
        state.fetchBookAllNoPaging.listBookAllNoPaging = action.payload;
        state.fetchBookAllNoPaging.error = null;
      })
      .addCase(getAllBooksNoPaging.rejected, (state, action) => {
        state.fetchBookAllNoPaging.listBookAllNoPaging = [];
        state.fetchBookAllNoPaging.error = action.payload;
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
      })

      // create  book
      .addCase(createBook.pending, (state) => {
        state.createBook.isLoading = true;
        state.createBook.success = false;
        state.createBook.error = null;
      })

      .addCase(createBook.fulfilled, (state) => {
        state.createBook.isLoading = false;
        state.createBook.success = true;
      })

      .addCase(createBook.rejected, (state, action) => {
        state.createBook.isLoading = false;
        state.createBook.success = false;
        state.createBook.error = action.payload;
      })

      // update book
      .addCase(updateBook.pending, (state) => {
        state.updateBook.isLoading = true;
        state.updateBook.error = null;
        state.updateBook.success = false;
      })
      .addCase(updateBook.fulfilled, (state) => {
        state.updateBook.isLoading = false;
        state.updateBook.success = true;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.updateBook.isLoading = false;
        state.updateBook.error = action.payload;
      })

      // delete book
      .addCase(deleteBook.pending, (state) => {
        state.deleteBook.isLoading = true;
        state.deleteBook.error = null;
        state.deleteBook.success = false;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.deleteBook.isLoading = false;
        state.deleteBook.success = true;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.deleteBook.isLoading = false;
        state.deleteBook.error = action.payload;
      });
  },
});

export const {
  resetCreateBookStatus,
  resetUpdateBookStatus,
  resetDeleteBookStatus,
} = bookSlice.actions;

export default bookSlice.reducer;
