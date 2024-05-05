'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setMenuSelected } from '@/store/slices/app';
import styles from './layout.module.scss';

const NotificationLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMenuSelected(5));
  }, []);

  return (
    <div className={styles['content']}>
      <div className={styles['tablist']}>
        <div className={`${styles['tab-item']} ${styles['active']} noselect`}>Tất cả</div>
        <div className={`${styles['tab-item']} noselect`}>Chưa đọc</div>
        <div className={`${styles['tab-item']} noselect`}>Bài viết</div>
        <div className={`${styles['tab-item']} noselect`}>Bình luận</div>
        <div className={`${styles['tab-item']} noselect`}>Bạn bè</div>
        <div className={`${styles['tab-item']} noselect`}>Lượt nhắc</div>
      </div>
      {children}
    </div>
  );
};

export default NotificationLayout;
