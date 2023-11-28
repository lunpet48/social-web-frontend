export const getOutgoingRequest = async () => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/outgoing-requests`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response;
};

export const getRecommendUser = async () => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/user/recommend`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response;
};

export const getIncomingRequest = async () => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/incoming-requests`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response;
};

export const getFriend = async (userId: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/friends?userId=${userId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  return response;
};

export const sendFriendRequest = async (targetId: string) => {
  const access_token = localStorage.getItem("token");

  const response = await fetch(`${process.env.API}/api/v1/relationship/friend-request`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetId: targetId,
    }),
  });

  return response;
};

export const cancelFriendRequest = async (targetId: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/friend-request`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetId: targetId }),
  });
  return response;
};

export const acceptFriendRequest = async (targetId: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/received-friend-requests`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetId: targetId,
    }),
  });
  return response;
};

export const denyFriendRequest = async (targetId: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/received-friend-requests`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetId: targetId,
    }),
  });
  return response;
};

export const deleteFriend = async (targetId: string) => {
  const access_token = localStorage.getItem("token");
  const response = await fetch(`${process.env.API}/api/v1/relationship/friends`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetId: targetId,
    }),
  });
  return response;
};
