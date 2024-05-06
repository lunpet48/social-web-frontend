'use client';
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setMenuSelected } from '@/store/slices/app';
import styles from './layout.module.scss';
import Link from 'next/link';

export const tabs = [
  { name: 'Tất cả', href: '/notification' },
  { name: 'Bài viết', href: '/notification/post' },
  { name: 'Bình luận', href: '/notification/comment' },
  { name: 'Bạn bè', href: '/notification/friend' },
  { name: 'Lượt nhắc', href: '/notification/quote' },
];

interface IContextProps {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

export const TabsContext = createContext({} as IContextProps);

const NotificationLayout = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].name);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMenuSelected(5));
  }, []);

  return (
    <div className={styles['content']}>
      <div className={styles['tablist']}>
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`${styles['tab-item']} ${
              selectedTab === tab.name && styles['active']
            } noselect`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <TabsContext.Provider value={{ setSelectedTab }}>{children}</TabsContext.Provider>
    </div>
  );
};

export default NotificationLayout;
