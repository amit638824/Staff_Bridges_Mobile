// jobService.ts
import axiosInstance from './authService';



/* ================================
   TYPES (MATCH API RESPONSE)
================================ */

export interface RecruiterJob {
  job_id: number;
  recruiter_id: number;
  title_id: number;
  category_id: number;
  company: string;
  shift: string;
city_name:string,
  job_title_name: string;
  category_name: string;
  category_image?: string;
locality_name:string;
  job_type: string;
  work_location: string;

  companylogo?: string;
  salary_min: string;
  salary_max: string;

  min_experience: string;
  max_experience: string;

  city_id: number;
  locality_id: number;
  gender: string;
  qualification: string;

  only_fresher: number;
  salary_benifits: string;
  working_days: string;

  openings: number;
  hiring_for_others: number;
  agency_id?: number | null;

  communication_window: any[];
  candidate_can_call: number;
  job_posting_for: string;
  verification_required: number;

  status: string;
  admin_comments?: string | null;
  description?: string | null;

  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

/* ================================
   API CALL
================================ */

export const getRecruiterJobList = async (): Promise<RecruiterJob[]> => {
  try {
    const response = await axiosInstance.get('/api/recruiter-jobpost-list');

    if (
      response.data?.success &&
      Array.isArray(response.data?.data?.items)
    ) {
      return response.data.data.items;
    }

    return [];
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    return [];
  }
};

export const getRecruiterJobDetails = async (jobId: number): Promise<RecruiterJob | null> => {
  try {
    const response = await axiosInstance.get(`/api/recruiter-job-details?id=${jobId}&page=1&limit=1`);
    if (response.data?.success && Array.isArray(response.data.data.items) && response.data.data.items.length > 0) {
      return response.data.data.items[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
};