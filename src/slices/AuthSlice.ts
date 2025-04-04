// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  phoneNumber: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: sessionStorage.getItem('authToken'),
  user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthInfo: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      sessionStorage.setItem('authToken', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    },
  },
});

export const { setAuthInfo, logout } = authSlice.actions;
export default authSlice.reducer;
