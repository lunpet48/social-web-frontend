export const getLikesOfPost = async (postId: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/post/${postId}/likes`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response;
};
