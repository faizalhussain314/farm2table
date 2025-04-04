// src/store/UserSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  phoneNumber: string;
  role: string;
  
}

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set the current user profile
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
     
    },
    // Update parts of the user profile
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    // Clear the current user profile
    clearUser(state) {
      state.currentUser = null;
     
      localStorage.removeItem('currentUser');
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
