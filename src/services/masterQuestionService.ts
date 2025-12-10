import axiosInstance from "./authService";

export const masterQuestionService = {
  // Get questions by category
  getQuestionsByCategory: (categoryId: number, page = 1, limit = 20) =>
    axiosInstance.get(
      `/api/master-questions?page=${page}&limit=${limit}&categoryId=${categoryId}`
    ),

  // Get options for a question
  getOptionsByQuestionId: (questionId: number, page = 1, limit = 20) =>
    axiosInstance.get(
      `/api/master-options?page=${page}&limit=${limit}&questionId=${questionId}`
    )
};
