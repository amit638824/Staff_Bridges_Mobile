import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/authService";

interface JobRole {
  id: number;
  name: string;
  description: string;
  status: number;
  image?: string;
}

interface JobRoleState {
  roles: JobRole[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

const initialState: JobRoleState = {
  roles: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalPages: 1,
  totalRecords: 0,
};

export const fetchJobRoles = createAsyncThunk(
  "jobRoles/fetchAll",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/master-category?page=${page}&limit=${limit}`
      );

      if (response.data.success) {
        return response.data.data; // contains currentPage, totalPages, items etc.
      }

      return rejectWithValue(response.data.message || "Failed to fetch job roles");
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "API error");
    }
  }
);

const jobRoleSlice = createSlice({
  name: "jobRoles",
  initialState,
  reducers: {
    clearJobRoleError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobRoles.fulfilled, (state, action: any) => {
        const { items, currentPage, totalPages, totalRecords } = action.payload;

        if (currentPage === 1) {
          state.roles = items; // RESET list
        } else {
          state.roles = [...state.roles, ...items]; // APPEND next page
        }

        state.page = currentPage;
        state.totalPages = totalPages;
        state.totalRecords = totalRecords;
        state.loading = false;
      })
      .addCase(fetchJobRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearJobRoleError } = jobRoleSlice.actions;
export default jobRoleSlice.reducer;
