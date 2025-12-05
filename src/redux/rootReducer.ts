import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import jobRoleReducer from "./slices/jobRoleSlice"

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
    jobRoles: jobRoleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;