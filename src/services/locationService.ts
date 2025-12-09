import axiosInstance from "./authService";

export const locationService = {
  getCitiesByState: (stateId: number, page: number) =>
    axiosInstance.get(`/api/master-city?stateId=${stateId}&page=${page}&limit=10`),

  getLocalitiesByCity: (cityId: number, page: number) =>
    axiosInstance.get(`/api/master-locality?cityId=${cityId}&page=${page}&limit=10`),
};
