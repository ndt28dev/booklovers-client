import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config/api";
import { data } from "react-router-dom";

export const fetchAllUser = createAsyncThunk(
  "user/fetchAllUser",
  async (
    { page = 1, limit = 5, role = "", search = "", phone = "", gender = "" },
    thunkAPI
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/users?page=${page}&limit=${limit}&role=${role}&search=${search}&phone=${phone}&gender=${gender}`
      );

      return {
        users: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy danh sách người dùng"
      );
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "user/loginAdmin",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/loginadmin`,
        credentials
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Đăng nhập admin thất bại"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/user/loginuser`,
        credentials
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const createNewUser = createAsyncThunk(
  "user/createUser",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Tạo tài khoản thất bại"
      );
    }
  }
);

export const getUserWithAddress = createAsyncThunk(
  "user/getUserWithAddress",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy thông tin người dùng"
      );
    }
  }
);

export const createUserAddress = createAsyncThunk(
  "user/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.post(
        `${API_URL}/api/user/address`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  "user/updateAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.put(
        `${API_URL}/api/user/address/up`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "user/setDefaultAddress",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.put(
        `${API_URL}/api/user/address/set-default`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  "user/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.delete(`${API_URL}/api/user/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (dataUp, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.put(`${API_URL}/api/user-profile`, dataUp, {
        headers: {
          Authorization: `Bearer ${token}`,
          headers: { "Content-Type": "multipart/form-data" },
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (dataUp, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/user`, dataUp);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/user/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (newPassword, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/user/update-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Cập nhật thất bại";
      return rejectWithValue(msg);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/google-login`, {
        token,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const facebookLogin = createAsyncThunk(
  "user/facebookLogin",
  async (facebookAccessToken, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/facebook-login`, {
        access_token: facebookAccessToken,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập Facebook thất bại"
      );
    }
  }
);

export const getAdminUserProfile = createAsyncThunk(
  "admin/getAdminUserProfile",
  async (_, thunkAPI) => {
    try {
      const tokenAdmin = localStorage.getItem("tokenAdmin");
      if (!tokenAdmin) throw new Error("Token Admin không tồn tại");

      const response = await axios.get(`${API_URL}/api/profileAdmin`, {
        headers: {
          Authorization: `Bearer ${tokenAdmin}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy thông tin Admin"
      );
    }
  }
);

export const importUsers = createAsyncThunk(
  "users/importUsers",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/api/users/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Import users thất bại"
      );
    }
  }
);

const initialState = {
  users: {
    list: [],
    pagination: null,
    error: null,
    isLoading: false,
  },
  createUser: {
    isLoading: false,
    error: null,
    success: false,
  },
  auth: {
    isLoading: false,
    isLoggedIn: false,
    error: null,
    userInfo: null,
  },
  adminAuth: {
    isLoading: false,
    isLoggedIn: false,
    error: null,
  },
  profile: {
    user: null,
    addresses: [],
    isLoading: false,
    error: null,
  },
  profileAdmin: {
    user: null,
  },
  createAddress: {
    loading: false,
    error: null,
    success: false,
  },
  updateAddress: {
    loading: false,
    error: null,
    success: false,
  },
  updateDefaultAddress: {
    error: null,
    success: false,
  },
  deleteAddress: {
    error: null,
    success: false,
  },
  updateUserProfile: {
    loading: false,
    success: false,
    error: null,
  },
  updateUser: {
    loading: false,
    success: false,
    error: null,
  },
  deleteUser: {
    loading: false,
    success: false,
    error: null,
  },
  updatePassword: {
    updatePassLoading: false,
    updatePassSuccess: false,
    updatePassError: null,
  },
  userLoginGoogle: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
  },
  loginFB: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  importUser: {
    isLoading: false,
    success: false,
    error: null,
    data: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetCreateUserStatus: (state) => {
      state.createUser = {
        isLoading: false,
        error: null,
        success: false,
      };
    },
    resetLoginUserState: (state) => {
      state.auth = {
        isLoading: false,
        isLoggedIn: false,
        error: null,
        userInfo: null,
      };
    },
    logoutUser: (state) => {
      state.auth = {
        isLoading: false,
        isLoggedIn: false,
        error: null,
        userInfo: null,
      };
      state.profile = {
        user: null,
      };
      localStorage.removeItem("token");
    },
    resetCreateAddress: (state) => {
      state.createAddress = {
        loading: false,
        error: null,
        success: false,
      };
    },
    resetUpdateAddress: (state) => {
      state.updateAddress = {
        loading: false,
        error: null,
        success: false,
      };
    },
    resetDefaultAddressStatus: (state) => {
      state.updateDefaultAddress = {
        error: null,
        success: false,
      };
    },
    resetDeleteressStatus: (state) => {
      state.deleteAddress = {
        error: null,
        success: false,
      };
    },
    resetUpdateUserProfileStatus: (state) => {
      state.updateUserProfile = {
        loading: false,
        success: false,
        error: null,
      };
    },
    resetUpdateUserStatus: (state) => {
      state.updateUser = {
        loading: false,
        success: false,
        error: null,
      };
    },
    resetDeleteUserStatus: (state) => {
      state.deleteUser = {
        loading: false,
        success: false,
        error: null,
      };
    },
    resetUpdatePasswordState: (state) => {
      state.updatePassword = {
        updatePassLoading: false,
        updatePassSuccess: false,
        updatePassError: null,
      };
    },
    logoutAdmin: (state) => {
      state.adminAuth = {
        isLoading: false,
        isLoggedIn: false,
        error: null,
      };
      localStorage.removeItem("tokenAdmin");
    },
    resetImportUserStatus: (state) => {
      state.importUser = {
        loading: false,
        success: false,
        error: null,
        data: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // User login
      .addCase(loginUser.pending, (state) => {
        state.auth.isLoading = true;
        state.auth.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.auth.isLoading = false;
        state.auth.isLoggedIn = true;
        state.auth.userInfo = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.auth.isLoading = false;
        state.auth.error = action.payload;
      })

      // Admin login
      .addCase(loginAdmin.pending, (state) => {
        state.adminAuth.isLoading = true;
        state.adminAuth.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.adminAuth.isLoading = false;
        state.adminAuth.isLoggedIn = true;
        localStorage.setItem("tokenAdmin", action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.adminAuth.isLoading = false;
        state.adminAuth.error = action.payload;
      })

      // Fetch all users
      .addCase(fetchAllUser.pending, (state) => {
        state.users.isLoading = true;
        state.users.error = null;
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.users.isLoading = false;
        state.users.list = action.payload.users;
        state.users.pagination = action.payload.pagination;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.users.isLoading = false;
        state.users.list = [];
        state.users.error = action.payload;
      })

      // Create new user
      .addCase(createNewUser.pending, (state) => {
        state.createUser.isLoading = true;
        state.createUser.success = false;
        state.createUser.error = null;
      })
      .addCase(createNewUser.fulfilled, (state) => {
        state.createUser.isLoading = false;
        state.createUser.success = true;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.createUser.isLoading = false;
        state.createUser.error = action.payload;
      })

      // get user by id
      .addCase(getUserWithAddress.pending, (state) => {
        state.profile.isLoading = true;
        state.profile.error = null;
      })
      .addCase(getUserWithAddress.fulfilled, (state, action) => {
        state.profile.isLoading = false;
        state.profile.user = action.payload.user;
        state.profile.addresses = action.payload.addresses;
      })
      .addCase(getUserWithAddress.rejected, (state, action) => {
        state.profile.isLoading = false;
        state.profile.error = action.payload;
      })
      // create Address
      .addCase(createUserAddress.pending, (state) => {
        state.createAddress.loading = true;
        state.createAddress.error = null;
        state.createAddress.success = false;
      })
      .addCase(createUserAddress.fulfilled, (state, action) => {
        state.createAddress.loading = false;
        state.createAddress.success = true;
      })
      .addCase(createUserAddress.rejected, (state, action) => {
        state.createAddress.loading = false;
        state.createAddress.error = action.payload;
      })
      // up address
      .addCase(updateUserAddress.pending, (state) => {
        state.updateAddress.loading = true;
        state.updateAddress.error = null;
        state.updateAddress.success = false;
      })
      .addCase(updateUserAddress.fulfilled, (state) => {
        state.updateAddress.loading = false;
        state.updateAddress.success = true;
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.updateAddress.loading = false;
        state.updateAddress.error = action.payload;
      })
      // del address
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.updateDefaultAddress.success = true;
        state.updateDefaultAddress.error = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.updateDefaultAddress.success = false;
        state.updateDefaultAddress.error =
          action.payload.message || "Lỗi xảy ra";
      })
      // del address
      .addCase(deleteUserAddress.fulfilled, (state) => {
        state.deleteAddress.success = true;
        state.deleteAddress.error = null;
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.deleteAddress.success = false;
        state.deleteAddress.error = action.payload;
      })

      // update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateUserProfile.loading = true;
        state.updateUserProfile.success = false;
        state.updateUserProfile.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateUserProfile.loading = false;
        state.updateUserProfile.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateUserProfile.loading = false;
        state.updateUserProfile.error = action.payload;
      })

      // update user
      .addCase(updateUser.pending, (state) => {
        state.updateUser.loading = true;
        state.updateUser.success = false;
        state.updateUser.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUser.loading = false;
        state.updateUser.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUser.loading = false;
        state.updateUser.error = action.payload;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleteUser.loading = true;
        state.deleteUser.success = false;
        state.deleteUser.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUser.loading = false;
        state.deleteUser.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUser.loading = false;
        state.deleteUser.error = action.payload;
      })

      // up password
      .addCase(updatePassword.pending, (state) => {
        state.updatePassword.updatePassLoading = true;
        state.updatePassword.updatePassError = null;
        state.updatePassword.updatePassSuccess = false;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.updatePassword.updatePassLoading = false;
        state.updatePassword.updatePassSuccess = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updatePassword.updatePassLoading = false;
        state.updatePassword.updatePassError = action.payload;
      })
      // Google login
      .addCase(googleLogin.pending, (state) => {
        state.userLoginGoogle.loading = true;
        state.userLoginGoogle.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.userLoginGoogle.loading = false;
        state.userLoginGoogle.user = action.payload.user;
        state.auth.isLoggedIn = true;
        // state.userLoginGoogle.accessToken = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.userLoginGoogle.loading = false;
        state.userLoginGoogle.error = action.payload;
      })

      // login fb
      .addCase(facebookLogin.pending, (state) => {
        state.loginFB.loading = true;
        state.loginFB.error = null;
      })
      .addCase(facebookLogin.fulfilled, (state, action) => {
        state.loginFB.loading = false;
        state.loginFB.user = action.payload.user;
        state.auth.isLoggedIn = true;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(facebookLogin.rejected, (state, action) => {
        state.loginFB.loading = false;
        state.loginFB.error = action.payload || "Lỗi xác thực";
      })

      // get admin profile
      .addCase(getAdminUserProfile.fulfilled, (state, action) => {
        state.profileAdmin.user = action.payload;
      })

      // import
      .addCase(importUsers.pending, (state) => {
        state.importUser.isLoading = true;
        state.importUser.error = null;
        state.importUser.success = false;
      })

      .addCase(importUsers.fulfilled, (state, action) => {
        state.importUser.isLoading = false;
        state.importUser.success = true;
        state.importUser.data = action.payload;
      })

      .addCase(importUsers.rejected, (state, action) => {
        state.importUser.isLoading = false;
        state.importUser.error = action.payload;
      });
  },
});

export const {
  resetCreateUserStatus,
  resetLoginUserState,
  logoutUser,
  resetCreateAddress,
  resetUpdateAddress,
  resetDefaultAddressStatus,
  resetDeleteressStatus,
  resetUpdateUserStatus,
  resetUpdateUserProfileStatus,
  resetUpdatePasswordState,
  resetDeleteUserStatus,
  logoutAdmin,
  resetImportUserStatus,
} = userSlice.actions;

export default userSlice.reducer;
