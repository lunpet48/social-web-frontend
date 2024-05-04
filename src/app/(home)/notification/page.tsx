'use client';
import NotificationCard from '@/component/NotificationCard/NotificationCard';
import { useEffect, useState } from 'react';
import { notification } from '@/type/type';
import { getNotification } from '@/services/notification';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<notification[]>([]);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    const data: notification[] = await getNotification();
    setNotifications(data);
  };

  return (
    <div>
      {notifications.map((notification) => {
        return <NotificationCard notification={notification} />;
      })}
    </div>
  );
};

export default NotificationPage;
