import { profile } from "@/type/type";

export const updateProfileInfo = async (body: profile) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    body: JSON.stringify(body),
  });
  return response;
};

export const updateAvatar = async (formData: FormData) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/profile/avatar`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    body: formData,
  });
  return response;
};

export const updateBackground = async (formData: FormData) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/profile/background`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    body: formData,
  });
  return response;
};
