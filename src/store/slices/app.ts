import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  menuSelected: { currentKey: number; previousKey: number };
  isSoundOn: boolean;
  countUnreadNotify: number;
  countUnreadMessage: number;
}

const initialState: AppState = {
  menuSelected: { currentKey: -1, previousKey: -1 },
  isSoundOn: false,
  countUnreadNotify: 0,
  countUnreadMessage: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMenuSelected: (state, action: PayloadAction<number>) => {
      state.menuSelected.previousKey = state.menuSelected.currentKey;
      state.menuSelected.currentKey = action.payload;
    },
    toggleIsSoundOn: (state) => {
      state.isSoundOn = !state.isSoundOn;
    },
    setCountUnreadMessage: (state, action: PayloadAction<number>) => {
      state.countUnreadMessage = action.payload;
    },
    setCountUnreadNotify: (state, action: PayloadAction<number>) => {
      state.countUnreadNotify = action.payload;
    },
  },
});

export const { setMenuSelected, toggleIsSoundOn, setCountUnreadMessage, setCountUnreadNotify } =
  appSlice.actions;

export default appSlice.reducer;
