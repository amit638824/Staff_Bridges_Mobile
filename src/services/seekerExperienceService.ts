import axiosInstance from "./authService";

interface SeekerExperiencePayload {
  categoryId: number;
  userId: number;
  experience: string | null;
  status?: number;
  createdBy?: number;
}

interface SeekerExperienceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const seekerExperienceService = {
  // Save seeker experience (POST - for new experience)
  saveSeekerExperience: (payload: SeekerExperiencePayload) =>
    axiosInstance.post<SeekerExperienceResponse>(
      `/api/seeker-experience`,
      payload
    ),

  // Update seeker experience (PUT - for existing experience)
  updateSeekerExperience: (id: number, payload: SeekerExperiencePayload) =>
    axiosInstance.put<SeekerExperienceResponse>(
      `/api/seeker-experience/${id}`,
      payload
    ),

  // Get seeker experience
  getSeekerExperience: (page: number = 1, limit: number = 10) =>
    axiosInstance.get<SeekerExperienceResponse>(
      `/api/seeker-experience?page=${page}&limit=${limit}`
    ),

  // Get seeker experience by user ID
  getSeekerExperienceByUserId: (userId: number, page: number = 1, limit: number = 10) =>
    axiosInstance.get<SeekerExperienceResponse>(
      `/api/seeker-experience?userId=${userId}&page=${page}&limit=${limit}`
    ),

  // Get seeker experience by categoryId and userId
  getSeekerExperienceByCategoryAndUser: (categoryId: number, userId: number) =>
    axiosInstance.get<SeekerExperienceResponse>(
      `/api/seeker-experience?categoryId=${categoryId}&userId=${userId}`
    ),
};