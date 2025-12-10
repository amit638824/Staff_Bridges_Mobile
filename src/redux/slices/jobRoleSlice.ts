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
  hasMore: boolean;
  isInitialized: boolean;
  searchQuery: string;
}

const initialState: JobRoleState = {
  roles: [],
  loading: false,
  error: null,
  page: 0,
  limit: 10,
  totalPages: 0,
  totalRecords: 0,
  hasMore: false,
  isInitialized: false,
  searchQuery: '',
};

export const fetchJobRoles = createAsyncThunk(
  "jobRoles/fetchAll",
  async ({ page, limit, name }: { page: number; limit: number; name?: string }, { rejectWithValue }) => {
    try {
      let url = `/api/master-category?page=${page}&limit=${limit}`;
      
      // Add name parameter only if search query has data
     if (name && name.trim().length > 0) {
  url += `&name=${name.trim()}`;
}


      const response = await axiosInstance.get(url);

      if (response.data.success) {
        const { items, currentPage, totalPages, totalRecords } = response.data.data;
    
        return {
          items,
          currentPage,
          totalPages,
          totalRecords,
          searchQuery: name || '',
        };
      }

      return rejectWithValue(response.data.message || "Failed to fetch job roles");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "API error");
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
    resetJobRoles(state) {
      state.roles = [];
      state.page = 0;
      state.totalPages = 0;
      state.totalRecords = 0;
      state.hasMore = false;
      state.error = null;
      state.loading = false;
      state.isInitialized = false;
      state.searchQuery = '';
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobRoles.pending, (state, action) => {
        const { page } = action.meta.arg;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobRoles.fulfilled, (state, action: any) => {
        const { items, currentPage, totalPages, totalRecords, searchQuery } = action.payload;


        // IMPORTANT: Always reset on page 1, append on other pages
        if (currentPage === 1) {
          state.roles = [...items]; // Fresh array for page 1
        } else {
          state.roles = [...state.roles, ...items]; // Append for subsequent pages
        }


        state.page = currentPage;
        state.totalPages = totalPages;
        state.totalRecords = totalRecords;
        state.hasMore = currentPage < totalPages;
        state.loading = false;
        state.error = null;
        state.isInitialized = true;
        state.searchQuery = searchQuery;

      })
      .addCase(fetchJobRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      });
  },
});

export const { clearJobRoleError, resetJobRoles, setSearchQuery } = jobRoleSlice.actions;
export default jobRoleSlice.reducer;