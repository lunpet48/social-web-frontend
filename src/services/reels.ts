export const getReels = async () => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/reel`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};
