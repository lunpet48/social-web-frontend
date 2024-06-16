import { chatroom } from '@/type/type';
import { extractChatroomNameAndAvatar } from '@/utils';

export const getChats = async () => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/chat`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  const chatrooms: chatroom[] = data.data;
  chatrooms.map((chatroom: chatroom) => {
    return extractChatroomNameAndAvatar(chatroom);
  });
  return chatrooms;
};

export const getOneChat = async (chatroomId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/chat/${chatroomId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  const chatroom: chatroom = data.data;
  return extractChatroomNameAndAvatar(chatroom);
};

export const newChat = async (userIds: string[]) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/chat/check`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userIds),
  });
  const data = await response.json();
  const chatroom: chatroom = data.data;
  return extractChatroomNameAndAvatar(chatroom);
};

export const getMessagesOfChatroom = async (roomId: string) => {
  const access_token = localStorage.getItem('token');

  const response = await fetch(`${process.env.API}/api/v1/chat/${roomId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const sendMessage = async (roomId: string, message: string) => {
  const access_token = localStorage.getItem('token');

  const formData: any = new FormData();
  const dto_object = new Blob(
    [
      JSON.stringify({
        roomId: roomId,
        message: message,
      }),
    ],
    {
      type: 'application/json',
    }
  );
  formData.append('message', dto_object, '');

  const response = await fetch(`${process.env.API}/api/v1/chat`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
    body: formData,
  });
  const data = await response.json();
  return data.data;
};

export const searchChatroom = async (keyword: string) => {
  const access_token = localStorage.getItem('token');

  const response = await fetch(`${process.env.API}/api/v1/chat/search?keyword=${keyword}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  const chatrooms: chatroom[] = data.data;
  chatrooms.map((chatroom: chatroom) => {
    return extractChatroomNameAndAvatar(chatroom);
  });
  return data.data;
};
