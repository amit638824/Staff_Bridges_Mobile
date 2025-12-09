import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/authService";

interface SeekerCategoryRequest {
  categoryId: number;
  userId: number;
  status: number;
  createdBy: number;
}

interface SeekerCategoryItem {
  job_id: number;
  job_categoryid: number;
  job_userid: number;
  category_name: string;
  category_image: string | null;
  user_fullname: string;
  user_email: string | null;
}

interface FetchSeekerCategoriesParams {
  page: number;
  limit: number;
  userId: number;
}

// Create Seeker Category
export const createSeekerCategory = createAsyncThunk(
  "seekerCategory/create",
  async (payload: SeekerCategoryRequest, { rejectWithValue }) => {
    console.log("🚀 Create Category Thunk Triggered. Payload:", payload);

    try {
      const response = await axiosInstance.post("/api/seeker-category", payload);
      console.log("✅ Create API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Create API Error in Thunk:", error.response?.data);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch Seeker Categories
export const fetchSeekerCategories = createAsyncThunk(
  "seekerCategory/fetchCategories",
  async (
    { page, limit, userId }: FetchSeekerCategoriesParams,
    { rejectWithValue }
  ) => {
    console.log(
      `🚀 Fetch Categories Thunk Triggered. Page: ${page}, Limit: ${limit}, UserId: ${userId}`
    );

    try {
      const response = await axiosInstance.get("/api/seeker-category", {
        params: {
          page,
          limit,
          userId,
        },
      });

      console.log("✅ Fetch Categories Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("❌ Fetch Categories Error in Thunk:", error.response?.data);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

interface SeekerCategoryState {
  // Create category
  loading: boolean;
  success: boolean;
  error: string | null;

  // Fetch categories
  categories: SeekerCategoryItem[];
  fetchLoading: boolean;
  fetchError: string | null;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
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
};

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
    // Create Category Cases
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

    // Fetch Categories Cases
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
  },
});

export const { resetCreateStatus, resetCategories } = seekerCategorySlice.actions;
export default seekerCategorySlice.reducer;