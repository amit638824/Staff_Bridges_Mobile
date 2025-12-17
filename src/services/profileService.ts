import axiosInstance from "./authService";
import { Platform } from "react-native";
interface UpdateProfilePayload {
  userId: number;
  fullName?: string;
  locality?: string;
  profilePic?: {
    uri: string;
    type: string;
    name: string;
  };
  resume?: {
    uri: string;
    type: string;
    name: string;
  };
}

// ✅ NEW: Additional profile update payload
interface UpdateAdditionalProfilePayload {
  userId: number;
  salary?: string;
  email?: string;
  alternateMobile?: string;
  gender?: string;
  education?: string;
}


// ✅ NEW: Single API response interface
interface UserInfoResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    user_id: number;
    user_uuid: string;
    user_fullName: string;
    user_email: string | null;
    user_mobile: string;
    user_alternateMobile: string | null;
    user_RoleId: number;
    user_languagePreference: string;
    user_gender: string;
    user_experinced: number;
    user_countryId: number;
    user_profile: string | null;
    user_profilePic: string | null;
    user_resume: string | null;
    user_stateId: number;
    user_city: string;
    user_locality: string;
    user_latitude: string;
    user_longitude: string;
    user_isVerified: number;
    user_isEmailVerified: number;
    user_isMobileVerified: number;
    user_salary: string;
    user_education: string;
    user_credits: string | null;
    user_status: number;
    user_createdAt: string;
    user_updatedAt: string;
    user_createdBy: number | null;
    user_updatedBy: number;
    roletbl_id: number;
    roletbl_roleName: string;
  };
  error: boolean;
}


export const profileService = {
  /**
   * ✅ NEW: Fetch complete user info from single API
   * @param userId - User ID
   * @returns Promise with user data
   */
  getUserInfo: async (userId: number): Promise<UserInfoResponse> => {
    try {
      
      const response = await axiosInstance.get<UserInfoResponse>(
        `/auth/user-info?id=${userId}`,
        {
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Update user profile with optional file uploads
   * @param payload - Profile data including optional profilePic and resume files
   * @returns Promise with updated profile data
   */
  updateUserProfile: async (payload: UpdateProfilePayload) => {
    try {

      const formData = new FormData();

      // ✅ Add required userId
      formData.append("userId", String(payload.userId));

      // ✅ Add optional text fields (only if provided and not empty)
      if (payload.fullName && payload.fullName.trim()) {
        formData.append("fullName", payload.fullName.trim());
      }

      if (payload.locality && payload.locality.trim()) {
        formData.append("locality", payload.locality.trim());
      }

      // ✅ Add optional files with proper structure
      if (payload.profilePic) {
        const profilePicUri = Platform.OS === "android" 
          ? payload.profilePic.uri 
          : payload.profilePic.uri.replace("file://", "");

        const profilePicFile: any = {
          uri: profilePicUri,
          type: payload.profilePic.type || "image/jpeg",
          name: payload.profilePic.name || `profile_${Date.now()}.jpg`,
        };

        formData.append("profilePic", profilePicFile);
      }

      if (payload.resume) {
        const resumeUri = Platform.OS === "android" 
          ? payload.resume.uri 
          : payload.resume.uri.replace("file://", "");

        const resumeFile: any = {
          uri: resumeUri,
          type: payload.resume.type || "application/pdf",
          name: payload.resume.name || `resume_${Date.now()}.pdf`,
        };

        formData.append("resume", resumeFile);
      }


      const response = await axiosInstance.put(
        "/auth/user-profile-update-pic-mobile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );


      return response;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Update only text fields (fullName, mobile, locality)
   */
  updateUserProfileText: async (
    userId: number,
    fullName?: string,
    locality?: string
  ) => {
    try {
      return await profileService.updateUserProfile({
        userId,
        fullName,
        locality,
      });
    } catch (error: any) {
      throw error;
    }
  },
 updateAdditionalProfile: async (
  payload: UpdateAdditionalProfilePayload
) => {
  try {

    const response = await axiosInstance.put(
      '/auth/user-profile-update-aditional',
      {
        userId: payload.userId,
        salary: payload.salary || undefined,
        email: payload.email || undefined,
        alternateMobile: payload.alternateMobile || undefined,
        gender: payload.gender || undefined,
        education: payload.education || undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    return response;
  } catch (error: any) {
    throw error;
  }
},


  /**
   * Upload profile picture only
   */
  uploadProfilePicture: async (
    userId: number,
    profilePic: { uri: string; type: string; name: string }
  ) => {
    try {
      return await profileService.updateUserProfile({
        userId,
        profilePic,
      });
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Upload resume only
   */
  uploadResume: async (
    userId: number,
    resume: { uri: string; type: string; name: string }
  ) => {
    try {
      return await profileService.updateUserProfile({
        userId,
        resume,
      });
    } catch (error: any) {
      throw error;
    }
  },
};