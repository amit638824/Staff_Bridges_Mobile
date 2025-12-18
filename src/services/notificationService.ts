// services/notificationService.ts
import axiosInstance from './authService';
import { RecruiterJob } from './jobService';

export interface NotificationJob {
  n_id: number;
  job_id: number;
  created_at: string;
}

export const getNotifications = async (userId: number = 1, page: number = 1, limit: number = 10): Promise<NotificationJob[]> => {
  try {
    const res = await axiosInstance.get(`/api/notification?userId=${userId}&page=${page}&limit=${limit}&isVerified=0`);
    return res.data?.data?.items ?? [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// utils/timeAgo.ts
export const getTimeAgo = (dateString: string) => {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - createdDate.getTime();

  const diffInMinutes = Math.floor(diff / 60000);
  const diffInHours = Math.floor(diff / 3600000);
  const diffInDays = Math.floor(diff / 86400000);

  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffInDays <= 10) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  return `10+ days ago`;
};
