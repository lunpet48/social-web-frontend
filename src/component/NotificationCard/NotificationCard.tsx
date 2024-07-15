import { notification } from '@/type/type';
import styles from './style.module.scss';
import { notificationType } from '@/type/enum';
import { Button } from 'antd';
import { acceptFriendRequest } from '@/services/friendService';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { extractNotifyContent, formatDate } from '@/utils';
import { readNotification } from '@/services/notification';

const NotificationCard = ({ notification }: { notification: notification }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: '' });

  const handleAcceptFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    try {
      setLoading(true);
      const response = await acceptFriendRequest(notification.actor.userId);
      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã chấp nhận kết bạn' });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  // const handleClickNotification = () => {
  //   console.log('notification clicked');
  //   switch (notification.notificationType) {
  //     case notificationType.FRIEND_REQUEST:
  //       redirect(`/profile/${notification.actor.username}`);
  //     default:
  //       redirect(`/profile/${notification.actor.username}`);
  //   }
  // };

  const href =
    notification.notificationType === notificationType.LIKE
      ? `/post/${notification.idType}`
      : notification.notificationType === notificationType.COMMENT
      ? `/post/${notification.idType}`
      : notification.notificationType === notificationType.MENTION_IN_COMMENT
      ? `/post/${notification.idType}`
      : notification.notificationType === notificationType.MENTION_IN_POST
      ? `/post/${notification.idType}`
      : `/profile/${notification.actor.username}`;

  return (
    <div
      className={styles['content']}
      onClick={() => {
        readNotification(notification.id);
        location.href = href;
      }}
    >
      <div>
        <img
          src={`${notification?.actor?.avatar ? notification.actor.avatar : '/default-avatar.jpg'}`}
        />
      </div>
      <div
        className={`${styles['actor-and-message']} ${
          notification.status === 'UNREAD' && styles['unread']
        }`}
      >
        <div className={styles['actor']}>
          {notification.actor.username}
          <div className={styles['time']}>{formatDate(notification.createdAt)}</div>
        </div>
        <div>{extractNotifyContent(notification).content}</div>
      </div>
      {loading ? (
        <Button style={{ background: '#efefef' }} disabled>
          Loading
        </Button>
      ) : status.isSuccess ? (
        <Button style={{ background: '#04AA6D', color: 'white' }} disabled>
          {status.text}
        </Button>
      ) : notification.notificationType === notificationType.FRIEND_REQUEST ? (
        <>
          {/* <Button
            type='primary'
            onClick={(e) => {
              handleAcceptFriendRequest(e);
            }}
          >
            Chấp nhận
          </Button> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NotificationCard;
