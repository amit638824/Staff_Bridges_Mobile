import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import jobRoleReducer from "./slices/jobRoleSlice"
import seekerCategoryReducer from "./slices/seekerCategorySlice";
import locationReducer from "./slices/locationSlice";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
    jobRoles: jobRoleReducer,
  seekerCategory: seekerCategoryReducer,   // 👈 ADD THIS
location: locationReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;