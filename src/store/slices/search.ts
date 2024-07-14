import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Search {
  history: string[];
}

const initialState: Search = {
  history: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<string>) => {
      const payload = action.payload;
      const prev = state.history.filter((value) => value !== payload);
      state.history = [payload, ...prev];
    },
    remove: (state, action: PayloadAction<number>) => {
      state.history = state.history.filter((value, index) => index !== action.payload);
    },
    removeAll: (state) => {
      state.history = [];
    },
  },
});

export const { add, remove, removeAll } = searchSlice.actions;

export default searchSlice.reducer;
