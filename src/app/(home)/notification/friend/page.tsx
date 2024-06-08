'use client';
import NotificationCard from '@/component/NotificationCard/NotificationCard';
import { getNotificationByType } from '@/services/notification';
import { notification } from '@/type/type';
import { useContext, useEffect, useState } from 'react';
import tabs from '../tabs';
import TabsContext from '../context';

const NotificationFriendPage = () => {
  const [notifications, setNotifications] = useState<notification[]>([]);
  const { setSelectedTab } = useContext(TabsContext);

  setSelectedTab(tabs[3].name);
  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    const data: notification[] = await getNotificationByType('friend');
    setNotifications(data);
  };

  return (
    <div>
      {notifications?.map((notification) => {
        return <NotificationCard key={notification.id} notification={notification} />;
      })}
    </div>
  );
};

export default NotificationFriendPage;
