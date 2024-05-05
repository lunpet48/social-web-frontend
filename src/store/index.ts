import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/authUser';
import appReducer from './slices/app';

export const store = configureStore({
  reducer: { user: userReducer, app: appReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
