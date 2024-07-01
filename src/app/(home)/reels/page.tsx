'use client';
import { getReels } from '@/services/reels';
import { post } from '@/type/type';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import ReelViewComponent from './ReelViewComponent/ReelViewComponent';

const ReelsPage = () => {
  const [reels, setReels] = useState<post[]>([]);

  const fetchAllReels = async () => {
    const data = await getReels();
    setReels(data);
  };

  useEffect(() => {
    fetchAllReels();
  }, []);

  return (
    <div className={styles['page']}>
      {reels.map((reel) => (
        <ReelViewComponent reel={reel} />
      ))}
    </div>
  );
};

export default ReelsPage;
