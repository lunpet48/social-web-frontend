export const postComment = async (
  postId: string,
  comment: string,
  repliedCommentId: string = '',
  file?: any
) => {
  const token = localStorage.getItem('token');
  const formData: any = new FormData();

  const dto_object = new Blob(
    [
      JSON.stringify({
        postId: postId,
        comment: comment,
        repliedCommentId: repliedCommentId,
      }),
    ],
    {
      type: 'application/json',
    }
  );
  formData.append('commentRequest', dto_object, '');
  file && formData.append('file', file.originFileObj);
  const response = await fetch(`${process.env.API}/api/v1/comment`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  });
  return response;
};
export const fetchCommentOfPost = async (postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/posts/${postId}/comments`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};
