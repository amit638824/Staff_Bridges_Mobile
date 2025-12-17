// ============================================
// userSlice.ts - FINAL FIXED VERSION
// ============================================
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/authService";
import { profileService } from "../../services/profileService";

// ============================================
// Types
// ============================================
export interface UserProfile {
  userId?: number;
  id?: number;
  fullName?: string;
  profilePic?: string;
  email?: string;
  phone?: string;
  gender?: string;
  salary?: string;
  education?: string;
  experienced?: string; // "0" | "1"
  latitude?: number;
  longitude?: number;
  city?: string;
  locality?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
  location: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: any;
}

// ============================================
// Initial State
// ============================================
const initialState: UserState = {
  profile: null,
  location: null,
  loading: false,
  error: null,
};

// ============================================
// Fetch User Profile
// ============================================
// ============================================
// Fetch User Profile (SINGLE SOURCE OF TRUTH)
// ============================================
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  number,
  { rejectValue: any }
>("user/fetchUserProfile", async (userId, { rejectWithValue }) => {
  try {
    const response = await profileService.getUserInfo(userId);

    if (response.success !== true) {
      return rejectWithValue(response.message || "Failed to fetch profile");
    }

    const d = response.data;

    return {
      // IDs
      userId: d.user_id,
      id: d.user_id,

      // Basic info
      fullName: d.user_fullName || "",
      email: d.user_email || "",
      phone: d.user_mobile || "",
        alternateMobile: d.user_alternateMobile || "",
      gender: d.user_gender || "",
      salary: d.user_salary || "",
      education: d.user_education || "",

      // Experience (KEEP STRING FORMAT FOR UI)
      experienced: String(d.user_experinced ?? "0"),

      // Location
      city: d.user_city,
      locality: d.user_locality,
      latitude: Number(d.user_latitude),
      longitude: Number(d.user_longitude),

      // Media
      profilePic: d.user_profilePic,
      resume: d.user_resume,

      // Meta
      updatedAt: d.user_updatedAt,
      role: d.roletbl_roleName,

      // Keep raw data if needed later
      raw: d,
    };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Error fetching profile"
    );
  }
});


// ============================================
// Update Basic Info (FULL FORM ONLY)
// ============================================
// ============================================
// Update Basic Info with FULL DEBUGGING
// ============================================
// ============================================
// Update Basic Info with FULL DEBUGGING
// ============================================
export const updateBasicInfo = createAsyncThunk<
  any,
  {
    userId: number;
    fullName: string;
    gender: string;
    salary: string;
    education: string;
    experience: string;
  }
>("user/updateBasicInfo", async (data, { rejectWithValue }) => {
  try {

    // ✅ Convert experience to backend format
    const experienceValue =
      data.experience.toLowerCase() === "experienced" ? 1 : 0;

    // ✅ Normalize gender
    const normalizedGender = data.gender === "male" ? "Male" : "Female";

    // ✅ Build payload
    const payload = {
      userId: data.userId,
      fullName: data.fullName.trim(),
      gender: normalizedGender,
      salary: data.salary && data.salary.trim() ? Number(data.salary.trim()) : 0,
      education: data.education, // ✅ Keep as-is, already formatted by frontend
      experinced: experienceValue,
    };

    // ✅ Make API call
    const response = await axiosInstance.put(
      "/auth/user-profile-update-basicinfo",
      payload
    );


    // ✅ Check success
    if (response.data?.success === true) {
      return response.data;
    }

    // ✅ If success is false, reject with full response
    const errorMsg = response.data?.message || response.data?.error || "Profile update failed";
   
    
    return rejectWithValue({
      message: errorMsg,
      data: response.data,
    });

  } catch (error: any) {

    // ✅ Better error extraction with full details
    const errorMessage = 
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to update profile";
    
    return rejectWithValue({
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }
});

// ============================================
// Slice
// ============================================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Replace full profile
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },

    // ✅ PARTIAL LOCAL UPDATE (IMPORTANT FIX)
    updateProfileField(
      state,
      action: PayloadAction<Partial<UserProfile>>
    ) {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },

    setLocation(
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) {
      state.location = action.payload;
      if (state.profile) {
        state.profile.latitude = action.payload.latitude;
        state.profile.longitude = action.payload.longitude;
      }
    },

    clearError(state) {
      state.error = null;
    },

    logout(state) {
      state.profile = null;
      state.location = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update basic info
      .addCase(updateBasicInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBasicInfo.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data;
        if (!data || !state.profile) return;

const experiencedValue =
  data?.experinced ??
  data?.experienced ??
  state.profile?.experienced ??
  "0";

        state.profile = {
          ...state.profile,
          fullName: data.fullName,
          gender: data.gender,
          salary: data.salary,
          education: data.education,
          experienced: String(experiencedValue),
          updatedAt: data.updatedAt,
        };
      })
      .addCase(updateBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ============================================
// Exports
// ============================================
export const {
  setUserProfile,
  updateProfileField, // ✅ USE THIS FOR SINGLE FIELD UPDATES
  setLocation,
  clearError,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
