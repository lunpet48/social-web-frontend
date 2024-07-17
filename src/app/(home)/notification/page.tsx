'use client';
import NotificationCard from '@/component/NotificationCard/NotificationCard';
import { useContext, useEffect, useState } from 'react';
import { notification } from '@/type/type';
import { getNotification, markAllRead } from '@/services/notification';
import TabsContext from './context';
import tabs from './tabs';
import { setCountUnreadNotify } from '@/store/slices/app';
import { useDispatch } from 'react-redux';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<notification[]>([]);

  const { setSelectedTab } = useContext(TabsContext);

  const dispatch = useDispatch();
  setSelectedTab(tabs[0].name);

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    const data: notification[] = await getNotification();
    setNotifications(data);
  };

  const markAllAsRead = async () => {
    const res = await markAllRead();
    if (res.status >= 200 && res.status < 300) {
      fetchNotification();
      dispatch(setCountUnreadNotify(0));
    }
  };

  return (
    <div>
      <div
        className='w-full text-right cursor-pointer text-md noselect hover:text-blue-400 hover:underline'
        onClick={markAllAsRead}
      >
        Đánh dấu tất cả là đã đọc
      </div>
      {notifications?.map((notification) => {
        return <NotificationCard key={notification.id} notification={notification} />;
      })}
    </div>
  );
};

export default NotificationPage;
