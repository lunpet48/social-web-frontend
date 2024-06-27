'use client';
import { useContext, useEffect, useState } from 'react';
import { Row } from 'antd';

import TabsContext from '../context';
import tabs from '../tabs';
import { album, post } from '@/type/type';
import Loading from '@/component/Loading';
import { fetchAlbumsByUsername } from '@/services/albumService';
import AlbumViewComponent from './AlbumViewComponent';
import { store } from '@/store';

const Albums = ({ params }: { params: { id: string } }) => {
  const { setSelectedTab } = useContext(TabsContext);

  const [albums, setAlbums] = useState<album[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = store.getState().user.user;

  setSelectedTab(tabs[2].name);

  const getAlbums = async () => {
    setLoading(true);
    const data: album[] = await fetchAlbumsByUsername(params.id);
    setAlbums(data);
    setLoading(false);
  };

  useEffect(() => {
    getAlbums();
  }, []);

  if (loading) {
    return <Loading height='50px' />;
  }

  return (
    <>
      <Row gutter={[10, 10]}>
        {albums.map((album, id) => {
          return (
            <AlbumViewComponent
              key={id}
              album={album}
              reload={getAlbums}
              hideOption={currentUser.username !== params.id}
            />
          );
        })}
      </Row>
    </>
  );
};

export default Albums;
