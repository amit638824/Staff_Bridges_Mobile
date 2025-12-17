import axiosInstance from "./authService";

interface UpdateLocationPayload {
  userId: number;
  countryId: number;
  stateId: number;
  city: string;
  locality: string;
  latitude: number;
  longitude: number;
}

export const locationService = {
  // ✅ Fetch user location
  getUserLocation: (userId: number) => {
    return axiosInstance.get(`/auth/user-location/${userId}`);
  },

  getCitiesByState: (stateId: number, page: number, name?: string) => {
    let url = `/api/master-city?stateId=${stateId}&page=${page}&limit=10`;

    if (name && name.trim().length > 0) {
      url += `&name=${name.trim()}`;
    }

    return axiosInstance.get(url);
  },

  getLocalitiesByCity: (cityId: number, page: number, name?: string) => {
    let url = `/api/master-locality?cityId=${cityId}&page=${page}&limit=10`;

    if (name && name.trim().length > 0) {
      url += `&name=${name.trim()}`;
    }

    return axiosInstance.get(url);
  },

  // ✅ Update user location
  updateUserLocation: (payload: UpdateLocationPayload) => {
    return axiosInstance.put(
      "/auth/user-profile-update-location",
      payload
    );
  },
};