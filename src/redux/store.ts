import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistStore, persistReducer, PERSIST, REHYDRATE } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // ✅ Persist both user AND location slices
  whitelist: ["user", "location"],
  timeout: 0,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore persist actions from serialization check
        ignoredActions: [PERSIST, REHYDRATE, 'persist/PERSIST'],
        ignoredPaths: ['_persist'],
      },
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;