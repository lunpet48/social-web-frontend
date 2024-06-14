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
