export const getPostsOfHashtag = async (hashtag: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/hashtag/${hashtag}/posts`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response;
};
