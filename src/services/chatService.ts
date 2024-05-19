export const getChats = async () => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/chat`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
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
  return data.data;
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
