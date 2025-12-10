// ============================================
// authSlice.ts - WITH DETAILED LOGGING
// ============================================
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/authService';

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (mobile: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        mobile,
        userType: 'seeker',
      });

      if (response.data.success === true) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('📱 sendOtp - Error:', error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Error sending OTP'
      );
    }
  }
);

export const loginWithOtp = createAsyncThunk(
  'auth/loginWithOtp',
  async ({ mobile, otp }: { mobile: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/mobile-login', {
        mobile,
        otp,
      });


      if (response.data.success === true) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to login');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error logging in');
    }
  }
);

interface AuthState {
  token: string | null;
  mobile: string;
  userId: number | null;
  newUserFlag: boolean;
  sendOtpLoading: boolean;
  loginLoading: boolean;
  error: string | null;
  otpSent: boolean;
}

const initialState: AuthState = {
  token: null,
  mobile: '',
  userId: null,
  newUserFlag: false,
  sendOtpLoading: false,
  loginLoading: false,
  error: null,
  otpSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMobile(state, action: PayloadAction<string>) {
      state.mobile = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    resetAuth(state) {
      state.token = null;
      state.mobile = '';
      state.userId = null;
      state.newUserFlag = false;
      state.otpSent = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.sendOtpLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.sendOtpLoading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.sendOtpLoading = false;
        state.otpSent = false;
        state.error = action.payload as string;
      });

    // Login with OTP
    builder
      .addCase(loginWithOtp.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.loginLoading = false;

        const payload = action.payload;

        // ✅ Try multiple ways to extract userId (defensive programming)
        let extractedUserId: number | null = null;
        let extractedToken: string | null = null;
        let extractedMobile: string = state.mobile;
        let isNewUser = false;
        let userData: any = null;

        // First, try to get user data
        userData = payload.data?.user;

        // Method 1: payload.data.user.user_id (with underscore - MAIN ONE)
        if (userData?.user_id) {
          extractedUserId = userData.user_id;
        }
        // Method 2: payload.data.user.userId
        else if (userData?.userId) {
          extractedUserId = userData.userId;
        }
        // Method 3: payload.data.user.id
        else if (userData?.id) {
          extractedUserId = userData.id;
        }
        // Method 4: payload.data.userId (sometimes flattened)
        else if (payload.data?.userId) {
          extractedUserId = payload.data.userId;
        }
        // Method 5: Try to find ANY numeric id-like field
        else if (userData) {
          const possibleIdFields = ['user_id', 'userId', 'id', 'uid', 'user_id_pk'];
          for (const field of possibleIdFields) {
            if (userData[field]) {
              extractedUserId = userData[field];
              break;
            }
          }
        }
        
        if (!extractedUserId) {
          console.error('❌ CRITICAL: No userId found!');
          console.error('userData object:', JSON.stringify(userData, null, 2));
          console.error('Full payload:', JSON.stringify(payload, null, 2));
        }

        // Extract token
        if (payload.data?.token) {
          extractedToken = payload.data.token;
        } else {
          console.warn('⚠️ No token found in response');
        }

        // Extract mobile
        if (userData?.mobile) {
          extractedMobile = userData.mobile;
        }

        // ✅ Determine if user is new (check user_fullName field)
        isNewUser = !userData?.user_fullName || userData.user_fullName === null || userData.user_fullName === '';

        // ✅ Store authentication data
        state.token = extractedToken;
        state.mobile = extractedMobile;
        state.userId = extractedUserId;
        state.newUserFlag = isNewUser;
        state.error = null;

      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMobile, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;