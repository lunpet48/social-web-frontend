import { paging } from '@/type/type';

export const getReels = async (paging: paging = { pageNo: 0, pageSize: 10 }) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.API}/api/v1/reel?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
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
