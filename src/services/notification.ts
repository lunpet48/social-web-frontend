export const getNotification = async (pageNo: number = 0, pageSize: number = 10) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.API}/api/v1/all-notification?pageNo=${pageNo}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    }
  );
  const data = await response.json();
  return data.data;
};

export const getNotificationByType = async (
  type: string,
  pageNo: number = 0,
  pageSize: number = 100
) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.API}/api/v1/notification/${type}?pageNo=${pageNo}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    }
  );
  const data = await response.json();
  return data.data;
};

export const readNotification = async (id: string) => {
  const access_token = localStorage.getItem('token');
  await fetch(`${process.env.API}/api/v1/notification/${id}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
};

export const getNotificationUnread = async (pageNo: number = 0, pageSize: number = 100) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.API}/api/v1/unread-notification?pageNo=${pageNo}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    }
  );
  const data = await response.json();
  return data.data;
};

export const markAllRead = async () => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/notification/mark-all-read`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  return response;
};
