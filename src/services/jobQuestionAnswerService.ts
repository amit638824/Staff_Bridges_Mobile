// src/services/jobQuestionAnswerService.ts
import axiosInstance from "./authService";

interface JobQuestionAnswerPayload {
  categoryId: number;
  questionId: number;
  userId: number;
  optionId: number;
}

export const jobQuestionAnswerService = {
  // Save / select an option
  saveAnswer: (payload: JobQuestionAnswerPayload) =>
    axiosInstance.post("/api/job-question-answer", payload),

  // Delete / deselect an option by answer ID
  deleteAnswer: (answerId: number) =>
    axiosInstance.delete(`/api/job-question-answer/${answerId}`),

  getAnswersByUserAndCategory: (userId: number, categoryId: number) =>
    axiosInstance.get("/api/job-question-answer", {
      params: {
        userId,
        categoryId,
        page: 1,
        limit: 100,
      },
    }),
};
