import { album, post, user } from '@/type/type';
import { fetchUserProfile } from './profileService';

export const fetchAlbumsByUserId = async (userId: string) => {
  const access_token = localStorage.getItem('token');

  const response = await fetch(`${process.env.API}/api/v1/album?userId=${userId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const fetchAlbumsByUsername = async (username: string) => {
  const user: user = await fetchUserProfile(username);
  const data: album[] = await fetchAlbumsByUserId(user.id);

  const albums: album[] = await Promise.all(
    data.map(async (a) => {
      const posts: post[] = await fetchPostsOfAlbum(a.id);
      if (posts.length > 0) {
        a.img = posts[0].files[0];
      }
      return a;
    })
  );

  return albums;
};

export const fetchPostsOfAlbum = async (albumId: string) => {
  const access_token = localStorage.getItem('token');

  const response = await fetch(`${process.env.API}/api/v1/album/${albumId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  const data = await response.json();
  return data.data;
};

export const createNewAlbum = async (albumName: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/album`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: albumName,
      posts: [],
    }),
  });
  const data = await response.json();
  return data;
};

export const addPostToAlbum = async (albumId: string, postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/album`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: albumId,
      posts: [
        {
          postId: postId,
        },
      ],
    }),
  });
  const data = await response.json();
  return data;
};

export const deleteAlbum = async (albumId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/album/${albumId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

export const changeAlbumName = async (albumId: string, albumName: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/album`, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: albumId,
      name: albumName,
    }),
  });
  const data = await response.json();
  return data;
};

export const removePostFromAlbum = async (postId: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/album/post/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
  });
  return response;
};
