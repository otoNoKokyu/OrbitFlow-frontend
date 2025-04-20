import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginType } from '@/features/Authentication/Model/auth.model';
import authService from '@/features/Authentication/service/auth.service';
import { setTokens, setUser } from './authSlice';


export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginType, { rejectWithValue, dispatch }) => {
    try {
      const tokens = await authService.callLogin(credentials);
      if (!tokens.access_token) return rejectWithValue('No access token');
      authService.persistTokens(tokens);
      dispatch(setTokens(tokens))
      const {username,user_id} = await authService.getMe();
      dispatch(setUser({username,user_id}))
      return { user:{username,user_id}, tokens };
    } catch (error: any) {
      rejectWithValue(error.message || 'Login failed');
    }
  }
);
