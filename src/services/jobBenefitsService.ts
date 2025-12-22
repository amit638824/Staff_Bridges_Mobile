// src/services/jobBenefitsService.ts
import axiosInstance from './authService'; // make sure this points to your axios instance

export interface JobBenefit {
  id: number;
  userid: number;
  jobid: number;
  benifitid: number;
  benifitname: string;
  description: string;
  isverified: number;
}

/**
 * Fetch benefits for a specific job
 * @param jobId - ID of the job
 * @returns array of benefit names
 */
export const getJobBenefits = async (jobId: number): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`/api/recruiter-job-benifit?page=1&limit=10&jobId=${jobId}`);
    if (response.data.success) {
      const items: JobBenefit[] = response.data.data.items;
      return items.map(item => item.benifitname);
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching job benefits:', error.response?.data || error.message);
    return [];
  }
};
