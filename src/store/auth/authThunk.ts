import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginType } from '@/features/Authentication/Model/auth.model';
import authService from '@/features/Authentication/service/auth.service';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginType, { rejectWithValue }) => {
    try {
      const tokens = await authService.callLogin(credentials);
      if (!tokens.access_token) return rejectWithValue('No access token');
      authService.persistTokens(tokens);
      const userResponse = await authService.getMe();
      const {
        responsePayload: { data: user },
      } = userResponse;
      return { user, tokens };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
