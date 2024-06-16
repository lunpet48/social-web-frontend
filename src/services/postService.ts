import { paging, user } from '@/type/type';
import { fetchUserProfile } from './profileService';
import { responseData } from './type';

export const getPosts = async (paging: paging = { pageNo: 0, pageSize: 10 }) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.API}/api/v1/home?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
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

export const fetchPostByUserId = async (userId: string) => {
  const responseData: responseData = { isSuccess: true };

  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/${userId}/posts`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    responseData.data = data.data;
  } else if (response.status === 404) {
    responseData.isSuccess = false;
    responseData.errorCode = '404';
    responseData.errorMessage = data;
  }
  return responseData;
};

export const fetchPostByUsername = async (username: string) => {
  const user: user = await fetchUserProfile(username);
  return await fetchPostByUserId(user.id);
};

export const fetchSavedPost = async () => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/saved/all-posts`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  if (response.status === 200) {
    const data = await response.json();
    return data.data;
  } else if (response.status === 401) {
    console.log('JWT expired');
  }
};

export const fetchLikedPost = async (paging: paging = { pageNo: 0, pageSize: 10 }) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.API}/api/v1/post/liked?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    }
  );
  if (response.status === 200) {
    const data = await response.json();
    return data.data;
  } else if (response.status === 401) {
    console.log('JWT expired');
  }
};

export const saveAPost = async (postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/save/${postId}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const removeAPostFromSaved = async (postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/save/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const fetchReelsByUserId = async (userId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/${userId}/reels`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const fetchReelsByUsername = async (username: string) => {
  const user: user = await fetchUserProfile(username);
  return await fetchReelsByUserId(user.id);
};

export const exploreReels = async () => {
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
