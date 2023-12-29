export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/user/changePassword`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};
