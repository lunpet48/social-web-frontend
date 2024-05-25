import { chatroom, message } from '@/type/type';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface chatroomState {
  chatrooms: chatroom[];

  selectedChatroom: chatroom | null;
}

const initialState: chatroomState = {
  chatrooms: [],
  selectedChatroom: null,
};

export const chatroomSlice = createSlice({
  name: 'chatrooms',
  initialState,
  reducers: {
    setSelectedChatroom: (state, action: PayloadAction<chatroom>) => {
      state.selectedChatroom = action.payload;
    },
    removeSelectedChatroom: (state) => {
      state.selectedChatroom = null;
    },
    setChatrooms: (state, action: PayloadAction<chatroom[]>) => {
      state.chatrooms = action.payload;
    },
    pushChatroom: (state, action: PayloadAction<chatroom>) => {
      const addedChatroom = action.payload;
      const existingChatroomIndex = state.chatrooms.findIndex(
        (room) => room.roomId === addedChatroom.roomId
      );

      if (existingChatroomIndex !== -1) {
        state.chatrooms.splice(existingChatroomIndex, 1);
      }
      state.chatrooms.unshift(addedChatroom);

      if (addedChatroom.roomId === state.selectedChatroom?.roomId) {
        state.selectedChatroom = addedChatroom;
      }
    },

    setMessages: (state, action: PayloadAction<{ roomId: string; messages: message[] }>) => {
      const { roomId, messages } = action.payload;

      const existingChatroomIndex = state.chatrooms.findIndex((room) => room.roomId === roomId);

      if (existingChatroomIndex !== -1) {
        const chatroom = state.chatrooms[existingChatroomIndex];
        chatroom.message = messages;

        if (roomId === state.selectedChatroom?.roomId) {
          state.selectedChatroom = chatroom;
        }
      }
    },
    pushMessage: (state, action: PayloadAction<message>) => {
      const message = action.payload;

      const existingChatroomIndex = state.chatrooms.findIndex(
        (room) => room.roomId === message.roomId
      );

      if (existingChatroomIndex !== -1) {
        const chatroom = state.chatrooms.splice(existingChatroomIndex, 1)[0];
        chatroom.message = [message, ...chatroom.message];
        state.chatrooms.unshift(chatroom);

        if (message.roomId === state.selectedChatroom?.roomId) {
          state.selectedChatroom = chatroom;
        }
      }
    },
  },
});

export const {
  setChatrooms,
  pushChatroom,
  pushMessage,
  setMessages,
  setSelectedChatroom,
  removeSelectedChatroom,
} = chatroomSlice.actions;

export default chatroomSlice.reducer;
