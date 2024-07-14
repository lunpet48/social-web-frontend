'use client';
import { getReels } from '@/services/reels';
import { paging, post } from '@/type/type';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import ReelViewComponent from './ReelViewComponent/ReelViewComponent';
import useElementOnScreen from '@/hooks/useElementOnScreen';
import Loading from '@/component/Loading';

const ReelsPage = () => {
  const [reels, setReels] = useState<post[]>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [paging, setPaging] = useState<paging>({ pageNo: 0, pageSize: 5 });

  const { ref, isVisible } = useElementOnScreen();

  const fetchAllReels = async (paging: paging) => {
    const data: post[] = await getReels(paging);
    if (data.length === 0) {
      setIsEnd(true);
    } else {
      setReels((prev) => [...prev, ...data]);
    }
  };

  // load more
  useEffect(() => {
    if (isVisible) {
      setPaging((prev) => {
        const nextPage = { ...prev, pageNo: prev.pageNo + 1 };
        fetchAllReels(nextPage);
        return nextPage;
      });
    }
  }, [ref, isVisible]);

  useEffect(() => {
    fetchAllReels(paging);
  }, []);

  return (
    <div className={styles['page']}>
      {reels.map((reel) => (
        <ReelViewComponent reel={reel} />
      ))}
      {!isEnd && (
        <div style={{ position: 'relative' }}>
          <Loading height='50px' />
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ position: 'absolute', top: '-500px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ReelsPage;
