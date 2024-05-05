import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  menuSelected: { currentKey: number; previousKey: number };
  isSoundOn: boolean;
}

const initialState: AppState = {
  menuSelected: { currentKey: 0, previousKey: 0 },
  isSoundOn: false,
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setMenuSelected: (state, action: PayloadAction<number>) => {
      state.menuSelected.previousKey = state.menuSelected.currentKey;
      state.menuSelected.currentKey = action.payload;
    },
    toggleIsSoundOn: (state) => {
      state.isSoundOn = !state.isSoundOn;
    },
  },
});

export const { setMenuSelected, toggleIsSoundOn } = appSlice.actions;

export default appSlice.reducer;
