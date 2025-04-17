import { KeyMeta } from '@/common/types/Auth/auth';
import { Login } from '@/features/Authentication/Model/auth.model';
import authService from '@/features/Authentication/service/auth.service';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from './authThunk';


interface AuthState {
  user: { username: string; user_id: string } | null;
  tokens: Login | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authService.getUserMeta([KeyMeta.USER]),
  tokens: authService.getUserMeta([KeyMeta.TOKEN]) as Login,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.removeUserMeta([KeyMeta.TOKEN, KeyMeta.USER]);
      state.user = null;
      state.tokens = null;
    },
    setUser(state, action: PayloadAction<{ username: string; user_id: string }>) {
      state.user = action.payload;
    },
    setTokens(state, action: PayloadAction<Login>) {
      authService.persistTokens(action.payload);
      state.tokens = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
