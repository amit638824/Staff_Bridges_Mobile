import axiosInstance from "./authService";

export const locationService = {
  getCitiesByState: (stateId: number, page: number, name?: string) => {
    let url = `/api/master-city?stateId=${stateId}&page=${page}&limit=10`;
    
    // Add name parameter only if search query has data
    if (name && name.trim().length > 0) {
      url += `&name=${encodeURIComponent(name.trim())}`;
    }
    
    return axiosInstance.get(url);
  },

  getLocalitiesByCity: (cityId: number, page: number, name?: string) => {
    let url = `/api/master-locality?cityId=${cityId}&page=${page}&limit=10`;
    
    // Add name parameter only if search query has data
    if (name && name.trim().length > 0) {
      url += `&name=${encodeURIComponent(name.trim())}`;
    }
    
    return axiosInstance.get(url);
  },
};