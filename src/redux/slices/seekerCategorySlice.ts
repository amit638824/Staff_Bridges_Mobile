import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/authService";

/* ======================================================
   TYPES
====================================================== */

export interface SeekerCategoryItem {
  job_id: number; // seeker-category ID (primary key)
  job_categoryid: number;
  job_userid: number;
  category_name: string;
  category_image: string | null;
  user_fullname: string;
  user_email: string | null;
}

interface SeekerCategoryRequest {
  categoryId: number;
  userId: number;
  status: number;
  createdBy: number;
}

interface FetchSeekerCategoriesParams {
  page: number;
  limit: number;
  userId: number;
}

/* ================= EXPERIENCE TYPES ================= */

interface SeekerExperienceItem {
  experience_id: number;
  experience_categoryid: number;
  experience_userid: number;
  experience_value: string;
  category_name: string;
}

interface FetchSeekerExperienceParams {
  userId: number | null;
  page?: number;
  limit?: number;
}

/* ======================================================
   ASYNC THUNKS
====================================================== */

// ✅ CREATE CATEGORY
export const createSeekerCategory = createAsyncThunk(
  "seekerCategory/create",
  async (payload: SeekerCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/seeker-category", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ✅ FETCH CATEGORIES
export const fetchSeekerCategories = createAsyncThunk(
  "seekerCategory/fetchCategories",
  async (
    { page, limit, userId }: FetchSeekerCategoriesParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/api/seeker-category", {
        params: { page, limit, userId },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ✅ DELETE CATEGORY BY ID
export const deleteSeekerCategory = createAsyncThunk(
  "seekerCategory/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/seeker-category/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ✅ FETCH EXPERIENCE
export const fetchSeekerExperienceByUser = createAsyncThunk(
  "seekerCategory/fetchSeekerExperienceByUser",
  async (
    { userId, page = 1, limit = 10 }: FetchSeekerExperienceParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/api/seeker-experience", {
        params: { userId, page, limit },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

/* ======================================================
   STATE
====================================================== */

interface SeekerCategoryState {
  loading: boolean;
  success: boolean;
  error: string | null;

  categories: SeekerCategoryItem[];
  fetchLoading: boolean;
  fetchError: string | null;
  currentPage: number;
  totalPages: number;
  totalRecords: number;

  experienceList: SeekerExperienceItem[];
  experienceLoading: boolean;
  experienceError: string | null;
}

const initialState: SeekerCategoryState = {
  loading: false,
  success: false,
  error: null,

  categories: [],
  fetchLoading: false,
  fetchError: null,
  currentPage: 1,
  totalPages: 0,
  totalRecords: 0,

  experienceList: [],
  experienceLoading: false,
  experienceError: null,
};

/* ======================================================
   SLICE
====================================================== */

const seekerCategorySlice = createSlice({
  name: "seekerCategory",
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    resetCategories: (state) => {
      state.categories = [];
      state.fetchLoading = false;
      state.fetchError = null;
      state.currentPage = 1;
      state.totalPages = 0;
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {

    /* ================= CREATE ================= */
    builder
      .addCase(createSeekerCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSeekerCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createSeekerCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    /* ================= FETCH ================= */
    builder
      .addCase(fetchSeekerCategories.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchSeekerCategories.fulfilled, (state, action) => {
        state.fetchLoading = false;
        const { data } = action.payload;
        state.categories = data.items || [];
        state.currentPage = data.currentPage;
        state.totalPages = data.totalPages;
        state.totalRecords = data.totalRecords;
      })
      .addCase(fetchSeekerCategories.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload as string;
      });

    /* ================= DELETE ================= */
    builder
      .addCase(deleteSeekerCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSeekerCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (item) => item.job_id !== action.payload.id
        );
      })
      .addCase(deleteSeekerCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /* ================= EXPERIENCE ================= */
    builder
      .addCase(fetchSeekerExperienceByUser.pending, (state) => {
        state.experienceLoading = true;
        state.experienceError = null;
      })
  .addCase(fetchSeekerExperienceByUser.fulfilled, (state, action) => {
  state.experienceLoading = false;

  const items: SeekerExperienceItem[] = action.payload?.data?.items || [];
  state.experienceList = items;

})


      .addCase(fetchSeekerExperienceByUser.rejected, (state, action) => {
        state.experienceLoading = false;
        state.experienceError = action.payload as string;
      });
  },
});

/* ======================================================
   EXPORTS
====================================================== */

export const {
  resetCreateStatus,
  resetCategories,
} = seekerCategorySlice.actions;

export default seekerCategorySlice.reducer;
