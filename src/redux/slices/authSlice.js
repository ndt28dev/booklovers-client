import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import API_URL from "../../config/api";

// Gửi OTP tới email
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Xác thực OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      // Chỉ xác thực OTP, không đổi mật khẩu
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Đổi mật khẩu sau khi xác thực
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        email,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Gửi OTP xác nhận email hiện tại
export const sendCurrentEmailOtp = createAsyncThunk(
  "auth/sendCurrentEmailOtp",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token"); // hoặc lấy từ state
      const response = await axios.post(
        `${API_URL}/email-change/send-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Xác thực OTP của email hiện tại
export const verifyCurrentEmailOtp = createAsyncThunk(
  "auth/verifyCurrentEmailOtp",
  async ({ otp }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/email-change/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Gửi email mới để cập nhật
export const confirmNewEmail = createAsyncThunk(
  "auth/confirmNewEmail",
  async ({ newEmail }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/email-change/update`,
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
// Gửi OTP tới số điện thoại
export const sendPhoneOtp = createAsyncThunk(
  "auth/sendPhoneOtp",
  async (phone, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/send-otp-phone`, {
        phone,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Gửi OTP thất bại"
      );
    }
  }
);

export const verifyPhoneOtp = createAsyncThunk(
  "auth/verifyPhoneOtp",
  async ({ phoneNumber, otp }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/verify-phone-otp`, {
        phoneNumber,
        otp,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Xác nhận OTP thất bại"
      );
    }
  }
);

// Gửi OTP bằng Firebase
export const sendPhoneOtpFirebase = createAsyncThunk(
  "auth/sendPhoneOtpFirebase",
  async (phone, thunkAPI) => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {},
          },
          auth
        );
      }

      const formattedPhone = phone.startsWith("+")
        ? phone
        : `+84${phone.slice(1)}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;

      return "Đã gửi mã OTP đến số điện thoại";
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Xác minh OTP
export const verifyPhoneOtpFirebase = createAsyncThunk(
  "auth/verifyPhoneOtpFirebase",
  async (otp, thunkAPI) => {
    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        throw new Error("Không tìm thấy phiên gửi OTP");
      }

      await confirmationResult.confirm(otp);
      return "Xác minh OTP thành công!";
    } catch (error) {
      return thunkAPI.rejectWithValue("OTP không đúng hoặc đã hết hạn");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (newPassword, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/api/users/update-password`,
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

const initialState = {
  otpVerified: false,
  sendOtpStatus: {
    loading: false,
    error: null,
    message: null,
  },
  verifyOtpStatus: {
    loading: false,
    error: null,
    message: null,
  },
  resetPasswordStatus: {
    loading: false,
    error: null,
    message: null,
  },
  // Email change
  sendCurrentEmailOtpStatus: {
    loading: false,
    error: null,
    message: null,
    success: false,
  },
  verifyCurrentEmailOtpStatus: {
    loading: false,
    error: null,
    message: null,
    success: false,
  },
  confirmNewEmailStatus: {
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  sendPhoneOtpStatus: {
    loading: false,
    error: null,
    message: null,
  },
  verifyPhoneOtpStatus: {
    loading: false,
    error: null,
    message: null,
  },
  phoneOtpVerified: false,
  updatePassword: {
    updatePassLoading: false,
    updatePassSuccess: false,
    updatePassError: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState(state) {
      state.otpVerified = false;
      state.sendOtpStatus = { loading: false, error: null, message: null };
      state.verifyOtpStatus = { loading: false, error: null, message: null };
      state.resetPasswordStatus = {
        loading: false,
        error: null,
        message: null,
      };
    },
    clearAllStatus(state) {
      state.sendOtpStatus = { loading: false, error: null, message: null };
      state.verifyOtpStatus = { loading: false, error: null, message: null };
      state.resetPasswordStatus = {
        loading: false,
        error: null,
        message: null,
      };
    },
    resetEmailChangeState(state) {
      state.sendCurrentEmailOtpStatus = {
        loading: false,
        error: null,
        message: null,
        success: false,
      };
      state.verifyCurrentEmailOtpStatus = {
        loading: false,
        error: null,
        message: null,
        success: false,
      };
      state.confirmNewEmailStatus = {
        loading: false,
        error: null,
        success: false,
        message: null,
      };
    },
    resetPhoneChangeState(state) {
      state.sendPhoneOtpStatus = { loading: false, error: null, message: null };
      state.verifyPhoneOtpStatus = {
        loading: false,
        error: null,
        message: null,
      };
      state.phoneOtpVerified = false;
    },
    resetUpdatePasswordState: (state) => {
      updatePassword = {
        updatePassLoading: false,
        updatePassSuccess: false,
        updatePassError: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Gửi OTP
      .addCase(sendOtp.pending, (state) => {
        state.sendOtpStatus.loading = true;
        state.sendOtpStatus.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.sendOtpStatus.loading = false;
        state.sendOtpStatus.message = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.sendOtpStatus.loading = false;
        state.sendOtpStatus.error = action.payload;
      })

      // Xác thực OTP
      .addCase(verifyOtp.pending, (state) => {
        state.verifyOtpStatus.loading = true;
        state.verifyOtpStatus.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyOtpStatus.loading = false;
        state.verifyOtpStatus.message = action.payload;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyOtpStatus.loading = false;
        state.verifyOtpStatus.error = action.payload;
      })

      // Đổi mật khẩu
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus.loading = true;
        state.resetPasswordStatus.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordStatus.loading = false;
        state.resetPasswordStatus.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordStatus.loading = false;
        state.resetPasswordStatus.error = action.payload;
      })

      .addCase(sendCurrentEmailOtp.pending, (state) => {
        state.sendCurrentEmailOtpStatus.loading = true;
      })
      .addCase(sendCurrentEmailOtp.fulfilled, (state, action) => {
        state.sendCurrentEmailOtpStatus.loading = false;
        state.sendCurrentEmailOtpStatus.message = action.payload;
      })
      .addCase(sendCurrentEmailOtp.rejected, (state, action) => {
        state.sendCurrentEmailOtpStatus.loading = false;
        state.sendCurrentEmailOtpStatus.error = action.payload;
      })

      .addCase(verifyCurrentEmailOtp.pending, (state) => {
        state.verifyCurrentEmailOtpStatus.loading = true;
      })
      .addCase(verifyCurrentEmailOtp.fulfilled, (state, action) => {
        state.verifyCurrentEmailOtpStatus.loading = false;
        state.verifyCurrentEmailOtpStatus.message = action.payload;
      })
      .addCase(verifyCurrentEmailOtp.rejected, (state, action) => {
        state.verifyCurrentEmailOtpStatus.loading = false;
        state.verifyCurrentEmailOtpStatus.error = action.payload;
      })

      .addCase(confirmNewEmail.pending, (state) => {
        state.confirmNewEmailStatus.loading = true;
      })
      .addCase(confirmNewEmail.fulfilled, (state, action) => {
        state.confirmNewEmailStatus.loading = false;
        state.confirmNewEmailStatus.success = true;
        state.confirmNewEmailStatus.message = action.payload;
      })
      .addCase(confirmNewEmail.rejected, (state, action) => {
        state.confirmNewEmailStatus.loading = false;
        state.confirmNewEmailStatus.error = action.payload;
      })
      // Gửi OTP
      .addCase(sendPhoneOtp.pending, (state) => {
        state.sendPhoneOtpStatus.loading = true;
        state.sendPhoneOtpStatus.error = null;
      })
      .addCase(sendPhoneOtp.fulfilled, (state, action) => {
        state.sendPhoneOtpStatus.loading = false;
        state.sendPhoneOtpStatus.message = action.payload;
      })
      .addCase(sendPhoneOtp.rejected, (state, action) => {
        state.sendPhoneOtpStatus.loading = false;
        state.sendPhoneOtpStatus.error = action.payload;
      })

      // Xác thực OTP
      .addCase(verifyPhoneOtp.pending, (state) => {
        state.verifyPhoneOtpStatus.loading = true;
        state.verifyPhoneOtpStatus.error = null;
      })
      .addCase(verifyPhoneOtp.fulfilled, (state, action) => {
        state.verifyPhoneOtpStatus.loading = false;
        state.verifyPhoneOtpStatus.message = action.payload;
        state.phoneOtpVerified = true;
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.verifyPhoneOtpStatus.loading = false;
        state.verifyPhoneOtpStatus.error = action.payload;
        state.phoneOtpVerified = false;
      })
      // Firebase OTP gửi
      .addCase(sendPhoneOtpFirebase.pending, (state) => {
        state.sendPhoneOtpStatus.loading = true;
        state.sendPhoneOtpStatus.error = null;
      })
      .addCase(sendPhoneOtpFirebase.fulfilled, (state, action) => {
        state.sendPhoneOtpStatus.loading = false;
        state.sendPhoneOtpStatus.message = action.payload;
      })
      .addCase(sendPhoneOtpFirebase.rejected, (state, action) => {
        state.sendPhoneOtpStatus.loading = false;
        state.sendPhoneOtpStatus.error = action.payload;
      })

      // Firebase OTP xác minh
      .addCase(verifyPhoneOtpFirebase.pending, (state) => {
        state.verifyPhoneOtpStatus.loading = true;
        state.verifyPhoneOtpStatus.error = null;
      })
      .addCase(verifyPhoneOtpFirebase.fulfilled, (state, action) => {
        state.verifyPhoneOtpStatus.loading = false;
        state.verifyPhoneOtpStatus.message = action.payload;
        state.phoneOtpVerified = true;
      })
      .addCase(verifyPhoneOtpFirebase.rejected, (state, action) => {
        state.verifyPhoneOtpStatus.loading = false;
        state.verifyPhoneOtpStatus.error = action.payload;
        state.phoneOtpVerified = false;
      });
  },
});

export const {
  resetAuthState,
  resetEmailChangeState,
  clearAllStatus,
  resetPhoneChangeState,
} = authSlice.actions;
export default authSlice.reducer;
