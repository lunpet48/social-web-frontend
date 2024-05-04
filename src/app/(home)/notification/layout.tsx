'use client';
import styles from './layout.module.scss';

const NotificationLayout = ({ children }: { children: React.ReactNode }) => {
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
