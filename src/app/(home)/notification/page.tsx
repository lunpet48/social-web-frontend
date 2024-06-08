'use client';
import NotificationCard from '@/component/NotificationCard/NotificationCard';
import { useContext, useEffect, useState } from 'react';
import { notification } from '@/type/type';
import { getNotification } from '@/services/notification';
import TabsContext from './context';
import tabs from './tabs';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<notification[]>([]);

  const { setSelectedTab } = useContext(TabsContext);

  setSelectedTab(tabs[0].name);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    const data: notification[] = await getNotification();
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

export default NotificationPage;
