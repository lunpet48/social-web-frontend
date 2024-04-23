export const fetchPostById = async (postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/post/${postId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const getLikesOfPost = async (postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/post/${postId}/likes`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  return response;
};
