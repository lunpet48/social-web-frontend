'use client';
import { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import TabsContext from '../context';
import tabs from '../tabs';
import styles from './albums.module.scss';
import { album, post } from '@/type/type';
import Loading from '@/component/Loading';
import { fetchAlbumsByUsername, fetchPostsOfAlbum } from '@/services/albumService';
import { usePathname, useRouter } from 'next/navigation';

const Albums = ({ params }: { params: { id: string } }) => {
  const { setSelectedTab } = useContext(TabsContext);

  const [albums, setAlbums] = useState<album[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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
    <Row gutter={[10, 10]}>
      {albums.map((album, id) => {
        return (
          <Col
            xs={8}
            key={id}
            onClick={() => {
              router.push(`${pathname}/${album.id}`);
            }}
          >
            <div className={`${styles['album-wrapper']} noselect`}>
              <img src={album.img || '/image_holder.jpg'} alt='' />
              <div className={styles['album-description']}>{album.name}</div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default Albums;
