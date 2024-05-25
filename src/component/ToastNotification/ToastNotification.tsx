import { useEffect, useState } from 'react';
import styles from './ToastNotification.module.scss';
import { toastNotify } from '@/type/type';

const PopupNotification = ({
  isShow,
  setIsShow,
  notifyContent,
}: {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  notifyContent: toastNotify;
}) => {
  useEffect(() => {
    if (isShow) {
      const timer = setTimeout(() => {
        setIsShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isShow]);

  return (
    isShow && (
      <div className={styles['wrapper']}>
        <div
          className={styles['close']}
          onClick={(e) => {
            e.stopPropagation();
            setIsShow(false);
          }}
        >
          ×
        </div>
        <div className={styles['content']}>
          <div className={styles['avatar-wrapper']}>
            <img src={`${notifyContent.image || '/default-avatar.jpg'}`} />
          </div>
          <div className={styles['name-and-notify-content']}>
            <div className={styles['name']}>{notifyContent.name}</div>
            <div className={styles['notify-content']}>{notifyContent.content}</div>
          </div>
        </div>
      </div>
    )
  );
};

export default PopupNotification;
