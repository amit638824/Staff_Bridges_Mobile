import axiosInstance from './authService';

export interface AppliedJob {
  aj_id: number;
  aj_userId: number;
  aj_status: number;
  aj_createdAt: string;

  job_id: number;
  job_titleId: number;
  job_categoryId: number;

  job_jobType: string;
  job_workLocation: string;
  job_qualification: string;

  job_salaryMin: string;
  job_salaryMax: string;

  job_createdAt: string;
}

export const getAppliedJobsByUser = async (
  userId: number
): Promise<AppliedJob[]> => {
  try {
    const res = await axiosInstance.get(
      `/api/recruiter-apply-job?page=1&userId=${userId}`
    );

    if (res.data?.success && Array.isArray(res.data?.data?.items)) {
      return res.data.data.items;
    }

    return [];
  } catch (e) {
    console.error('Applied jobs error', e);
    return [];
  }
};
