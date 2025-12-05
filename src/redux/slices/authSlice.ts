// ============================================
// authSlice.ts - WITH DETAILED LOGGING
// ============================================
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/authService';

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (mobile: string, { rejectWithValue }) => {
    try {
      console.log('📱 sendOtp - Sending OTP to:', mobile);
      const response = await axiosInstance.post('/auth/send-otp', {
        mobile,
        userType: 'seeker',
      });

      console.log('📱 sendOtp - Response:', response.data);

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
      console.log('🔐 loginWithOtp - Attempting login with mobile:', mobile);
      const response = await axiosInstance.post('/auth/mobile-login', {
        mobile,
        otp,
      });

      console.log('🔐 loginWithOtp - Raw Response:', JSON.stringify(response.data, null, 2));

      if (response.data.success === true) {
        console.log('🔐 loginWithOtp - Success! Response data:', response.data);
        return response.data;
      } else {
        console.error('🔐 loginWithOtp - Failed:', response.data.message);
        return rejectWithValue(response.data.message || 'Failed to login');
      }
    } catch (error: any) {
      console.error('🔐 loginWithOtp - Exception:', error);
      console.error('🔐 loginWithOtp - Error Response:', error.response?.data);
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
      console.log('setMobile reducer - Setting mobile to:', action.payload);
      state.mobile = action.payload;
    },
    clearError(state) {
      console.log('clearError reducer - Clearing error');
      state.error = null;
    },
    resetAuth(state) {
      console.log('resetAuth reducer - Resetting auth state');
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
        console.log('sendOtp.pending');
        state.sendOtpLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        console.log('sendOtp.fulfilled');
        state.sendOtpLoading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        console.log('sendOtp.rejected - Error:', action.payload);
        state.sendOtpLoading = false;
        state.otpSent = false;
        state.error = action.payload as string;
      });

    // Login with OTP
    builder
      .addCase(loginWithOtp.pending, (state) => {
        console.log('loginWithOtp.pending');
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        console.log('loginWithOtp.fulfilled - Processing payload');
        state.loginLoading = false;

        const payload = action.payload;
        
        console.log('🔍 Full Payload:', JSON.stringify(payload, null, 2));
        console.log('🔍 Payload Keys:', Object.keys(payload));
        console.log('🔍 Payload.data Keys:', payload.data ? Object.keys(payload.data) : 'NO DATA');
        console.log('🔍 Payload.data.user:', payload.data?.user);

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
          console.log('✅ Method 1: Found userId in payload.data.user.user_id:', userData.user_id);
          extractedUserId = userData.user_id;
        }
        // Method 2: payload.data.user.userId
        else if (userData?.userId) {
          console.log('✅ Method 2: Found userId in payload.data.user.userId:', userData.userId);
          extractedUserId = userData.userId;
        }
        // Method 3: payload.data.user.id
        else if (userData?.id) {
          console.log('✅ Method 3: Found userId in payload.data.user.id:', userData.id);
          extractedUserId = userData.id;
        }
        // Method 4: payload.data.userId (sometimes flattened)
        else if (payload.data?.userId) {
          console.log('✅ Method 4: Found userId in payload.data.userId:', payload.data.userId);
          extractedUserId = payload.data.userId;
        }
        // Method 5: Try to find ANY numeric id-like field
        else if (userData) {
          console.log('🔍 Method 5: Searching for numeric ID in user object');
          const possibleIdFields = ['user_id', 'userId', 'id', 'uid', 'user_id_pk'];
          for (const field of possibleIdFields) {
            if (userData[field]) {
              console.log(`✅ Found ID in field "${field}":`, userData[field]);
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
          console.log('✅ Found token');
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

        console.log('📊 Extracted Data:');
        console.log('  UserId:', extractedUserId);
        console.log('  Token:', extractedToken ? '***SET***' : 'NOT SET');
        console.log('  Mobile:', extractedMobile);
        console.log('  user_fullName:', userData?.user_fullName || 'NOT SET');
        console.log('  IsNewUser:', isNewUser);
        console.log('📊 Full userData object:', JSON.stringify(userData, null, 2));

        // ✅ Store authentication data
        state.token = extractedToken;
        state.mobile = extractedMobile;
        state.userId = extractedUserId;
        state.newUserFlag = isNewUser;
        state.error = null;

        console.log('✅ Auth State Updated:', {
          userId: state.userId,
          token: state.token ? '***SET***' : 'NOT SET',
          mobile: state.mobile,
          newUserFlag: state.newUserFlag,
        });
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        console.log('loginWithOtp.rejected - Error:', action.payload);
        state.loginLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMobile, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;