import { combineReducers, createSlice } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: { count: 0 },
  reducers: {
    startLoading: (state) => {
      state.count += 1;
    },
    stopLoading: (state) => {
      state.count = Math.max(state.count - 1, 0);
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingSlice.reducer,
});

export default rootReducer;
