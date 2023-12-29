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

export const requestSendOtpForgotPasword = async (data: { email: string }) => {
  const response = await fetch(`${process.env.API}/api/v1/auth/forgot-pasword/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
  otpCode: string;
}) => {
  const response = await fetch(`${process.env.API}/api/v1/auth/resetPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};
