import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/api";

export const fetchAllBlog = createAsyncThunk(
  "blogs/fetchAllBlog",
  async ({ page = 1, limit = 6 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/blogs?page=${page}&limit=${limit}`
      );
      return {
        blogs: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách blog"
      );
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/blog/${id}`);
      return {
        blog: response.data.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy blog theo ID"
      );
    }
  }
);

export const fetchAllBlogFeatured = createAsyncThunk(
  "blogs/fetchAllBlogFeatured",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/featured`);
      return {
        blogs: response.data.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách blog nổi bật"
      );
    }
  }
);

const initialState = {
  listState: {
    listBlog: [],
    pagination: null,
    error: null,
  },
  detailState: {
    blogDetail: null,
    isLoading: false,
    error: null,
  },
  featuredState: {
    listFeatured: [],
    error: null,
  },
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchAllBlog.pending, (state) => {
        state.listState.isLoading = true;
        state.listState.error = null;
      })
      .addCase(fetchAllBlog.fulfilled, (state, action) => {
        state.listState.isLoading = false;
        state.listState.listBlog = action.payload.blogs;
        state.listState.pagination = action.payload.pagination;
      })
      .addCase(fetchAllBlog.rejected, (state, action) => {
        state.listState.isLoading = false;
        state.listState.error = action.payload;
      })

      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.detailState.isLoading = true;
        state.detailState.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.detailState.isLoading = false;
        state.detailState.blogDetail = action.payload.blog;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.detailState.isLoading = false;
        state.detailState.error = action.payload;
      })

      // Fetch featured blogs
      .addCase(fetchAllBlogFeatured.pending, (state) => {
        state.featuredState.error = null;
      })
      .addCase(fetchAllBlogFeatured.fulfilled, (state, action) => {
        state.featuredState.listFeatured = action.payload.blogs;
      })
      .addCase(fetchAllBlogFeatured.rejected, (state, action) => {
        state.featuredState.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
