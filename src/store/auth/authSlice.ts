import { KeyMeta, User } from '@/common/types/Auth/auth';
import { Login } from '@/features/Authentication/Model/auth.model';
import authService from '@/features/Authentication/service/auth.service';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: Partial<User> | null;
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
});

export const { logout, setUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
