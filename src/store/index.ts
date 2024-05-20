import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/authUser';
import appReducer from './slices/app';
import chatroomReducer from './slices/chatroom';

export const store = configureStore({
  reducer: { user: userReducer, app: appReducer, chatrooms: chatroomReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
