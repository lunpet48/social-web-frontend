import { user } from '@/type/type';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface userState {
  user: user;
}

const initialState: userState = {
  user: { id: '' },
};

export const authUserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: user; accessToken: string }>) => {
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.accessToken);
    },
    setUser: (state, action: PayloadAction<user>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = initialState.user;
      localStorage.removeItem('token');
    },
  },
});

export const { login, setUser, logout } = authUserSlice.actions;

export default authUserSlice.reducer;
