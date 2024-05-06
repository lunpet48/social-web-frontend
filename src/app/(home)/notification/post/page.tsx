'use client';
import NotificationCard from '@/component/NotificationCard/NotificationCard';
import { getNotificationByType } from '@/services/notification';
import { notification } from '@/type/type';
import { useContext, useEffect, useState } from 'react';
import { TabsContext, tabs } from '../layout';

const NotificationPostPage = () => {
  const [notifications, setNotifications] = useState<notification[]>([]);

  const { setSelectedTab } = useContext(TabsContext);

  setSelectedTab(tabs[1].name);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    const data: notification[] = await getNotificationByType('post');
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

export default NotificationPostPage;
