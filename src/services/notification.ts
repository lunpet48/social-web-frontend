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
