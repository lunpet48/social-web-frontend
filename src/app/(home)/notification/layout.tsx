'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setMenuSelected } from '@/store/slices/app';
import styles from './layout.module.scss';
import Link from 'next/link';
import tabs from './tabs';
import TabsContext from './context';

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
