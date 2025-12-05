import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/authService";

interface JobRole {
  id: number;
  name: string;
  description: string;
  status: number;
}

interface JobRoleState {
  roles: JobRole[];
  loading: boolean;
  error: string | null;
}

const initialState: JobRoleState = {
  roles: [],
  loading: false,
  error: null,
};

export const fetchJobRoles = createAsyncThunk(
  "jobRoles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/master-category");

      if (response.data.success === true) {
        return response.data.data; // return array
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
        state.error = null;
      })
      .addCase(fetchJobRoles.fulfilled, (state, action: PayloadAction<JobRole[]>) => {
        state.roles = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchJobRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearJobRoleError } = jobRoleSlice.actions;
export default jobRoleSlice.reducer;
