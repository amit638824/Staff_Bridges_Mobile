import axiosInstance from './authService';
import { RecruiterJob } from './jobService';

/* ===============================
   COMMON RESPONSE TYPE
================================ */
interface PaginatedResponse<T> {
  success: boolean;
  data: {
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
    items: T[];
  };
}

/* ===============================
   APPLY TO JOBS
================================ */
export const getApplyToJobs = async () => {
  const res = await axiosInstance.get<PaginatedResponse<RecruiterJob>>(
    '/api/recruiter-best-job-your?page=1&limit=10'
  );
  return res.data?.data?.items ?? [];
};

/* ===============================
   NEAR BY JOBS
================================ */
export const getNearbyJobs = async () => {
  const res = await axiosInstance.get<PaginatedResponse<any>>(
    '/api/recruiter-jobs-in-near-by-areas?page=1&limit=10'
  );
  return res.data?.data?.items ?? [];
};

/* ===============================
   SIMILAR JOBS
================================ */
export const getSimilarJobs = async () => {
  const res = await axiosInstance.get<PaginatedResponse<RecruiterJob>>(
    '/api/recruiter-similar-jobs?page=1&limit=10'
  );
  return res.data?.data?.items ?? [];
};

/* ===============================
   JOB CATEGORIES
================================ */
export const getJobCategories = async () => {
  const res = await axiosInstance.get<PaginatedResponse<any>>(
    '/api/recruiter-choose-from-job-categories?page=1&limit=10'
  );
  return res.data?.data?.items ?? [];
};
