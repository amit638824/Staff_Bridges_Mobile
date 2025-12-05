// ============================================
// userSlice.ts - ONLY handles user profile
// ============================================
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/authService";

export interface UserProfile {
  userId?: number;
  id?: number;
  fullName?: string;
  gender?: string;
  salary?: string;
  education?: string;
  latitude?: number;
  longitude?: number;
  updatedAt?: string;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
  location: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: any;
}

const initialState: UserState = {
  profile: null,
  location: null,
  loading: false,
  error: null,
};

export const updateBasicInfo = createAsyncThunk<
  any,
  { 
    userId: number; 
    fullName: string; 
    gender: string; 
    salary: string; 
    education: string;
    experience: string;  // "experienced" | "fresher"
  }
>(
  "user/updateBasicInfo",
  async ({ userId, fullName, gender, salary, education, experience }, { rejectWithValue }) => {
    try {

      // Convert experience to 1 or 0
      const experienceValue = experience === "experienced" ? "1" : "0";

      const payload = {
        userId,
        fullName: fullName.trim(),
        gender: gender === "male" ? "Male" : "Female",
        salary: Number(salary),
        education: education,
        experienced: experienceValue   // <-- FIXED
      };

      console.log("FINAL PAYLOAD SENT TO API:", payload);

      const response = await axiosInstance.put(
        "/auth/user-profile-update-basicinfo",
        payload
      );

      if (response.data.success === true) {
        return response.data;
      }
      return rejectWithValue(response.data.message || "Failed to update profile");

    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error updating profile");
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Set profile when user logs in
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },

    // ✅ Set location
    setLocation(state, action: PayloadAction<{ latitude: number; longitude: number }>) {
      state.location = action.payload;
      // Also update profile with location
      if (state.profile) {
        state.profile.latitude = action.payload.latitude;
        state.profile.longitude = action.payload.longitude;
      }
    },

    // ✅ Logout
    logout(state) {
      state.profile = null;
      state.location = null;
    },

    // ✅ Clear error
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBasicInfo.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ API returns data in response.data
        const responseData = action.payload.data;

        if (responseData) {
          // ✅ Map API response to profile
          state.profile = {
            ...state.profile,
            userId: responseData.id, // API returns 'id', we store as 'userId'
            id: responseData.id,
            fullName: responseData.fullName,
            gender: responseData.gender,
            salary: responseData.salary,
            education: responseData.education,
            updatedAt: responseData.updatedAt,
          };
        }

        state.error = null;
      })
      .addCase(updateBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserProfile, setLocation, logout, clearError } = userSlice.actions;
export default userSlice.reducer;