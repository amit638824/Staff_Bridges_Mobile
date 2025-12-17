import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { locationService } from '../../services/locationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationState {
  countryId: number | null;
  stateId: number | null;
  city: string;
  locality: string;
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

// ✅ Type for persisting (without loading/error)
interface LocationCache {
  countryId: number | null;
  stateId: number | null;
  city: string;
  locality: string;
  latitude: number | null;
  longitude: number | null;
}

const initialState: LocationState = {
  countryId: null,
  stateId: null,
  city: '',
  locality: '',
  latitude: null,
  longitude: null,
  loading: false,
  error: null,
};

// =================== FETCH LOCATION THUNK ===================
export const fetchUserLocation = createAsyncThunk(
  'location/fetchUserLocation',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await locationService.getUserLocation(userId);

      if (response.data?.success) {
        const data = response.data.data || response.data;
        
        
        const locationData: LocationCache = {
          countryId: data.countryId || null,
          stateId: data.stateId || null,
          city: data.city || '',
          locality: data.locality || '',
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        };

        // ✅ Persist to AsyncStorage
        await persistLocation(locationData);
        
        return locationData;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to fetch location'
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Location fetch failed'
      );
    }
  }
);

// =================== UPDATE LOCATION THUNK ===================
export const updateUserLocation = createAsyncThunk(
  'location/updateUserLocation',
  async (
    payload: {
      userId: number;
      countryId: number;
      stateId: number;
      city: string;
      locality: string;
      latitude: number;
      longitude: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await locationService.updateUserLocation(payload);

      if (response.data?.success) {
        
        const locationData: LocationCache = {
          countryId: payload.countryId,
          stateId: payload.stateId,
          city: payload.city,
          locality: payload.locality,
          latitude: payload.latitude,
          longitude: payload.longitude,
        };

        // ✅ Persist to AsyncStorage
        await persistLocation(locationData);
        
        return locationData;
      }

      return rejectWithValue(
        response.data?.message || 'Failed to update location'
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Location update failed'
      );
    }
  }
);

// =================== PERSISTENCE HELPER ===================
async function persistLocation(location: LocationCache) {
  try {
    await AsyncStorage.setItem(
      '@user_location_cache',
      JSON.stringify(location)
    );
  } catch (error) {
  }
}

// =================== SLICE ===================
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocationError(state) {
      state.error = null;
    },
    resetLocation(state) {
      return initialState;
    },
    // ✅ Allow setting location directly from GPS or other sources
    setLocation(
      state,
      action: PayloadAction<{
        city?: string;
        locality?: string;
        latitude?: number;
        longitude?: number;
        countryId?: number;
        stateId?: number;
      }>
    ) {
      state.city = action.payload.city ?? state.city;
      state.locality = action.payload.locality ?? state.locality;
      state.latitude = action.payload.latitude ?? state.latitude;
      state.longitude = action.payload.longitude ?? state.longitude;
      state.countryId = action.payload.countryId ?? state.countryId;
      state.stateId = action.payload.stateId ?? state.stateId;

      // ✅ Persist after any change
      const cacheData: LocationCache = {
        countryId: state.countryId,
        stateId: state.stateId,
        city: state.city,
        locality: state.locality,
        latitude: state.latitude,
        longitude: state.longitude,
      };
      persistLocation(cacheData);
    },
  },
  extraReducers: builder => {
    // ================== FETCH LOCATION ==================
    builder
      .addCase(fetchUserLocation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserLocation.fulfilled,
        (state, action: PayloadAction<LocationCache>) => {
          state.loading = false;
          state.countryId = action.payload.countryId;
          state.stateId = action.payload.stateId;
          state.city = action.payload.city;
          state.locality = action.payload.locality;
          state.latitude = action.payload.latitude;
          state.longitude = action.payload.longitude;
          state.error = null;
        }
      )
      .addCase(fetchUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ================== UPDATE LOCATION ==================
      .addCase(updateUserLocation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserLocation.fulfilled, (state, action: PayloadAction<LocationCache>) => {
        state.loading = false;
        state.countryId = action.payload.countryId;
        state.stateId = action.payload.stateId;
        state.city = action.payload.city;
        state.locality = action.payload.locality;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.error = null;
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLocationError, resetLocation, setLocation } = locationSlice.actions;
export default locationSlice.reducer;