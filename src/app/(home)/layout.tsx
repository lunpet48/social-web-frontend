'use client';
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';

import Loading from '@/component/Loading';
import { useAuth } from '@/context/AuthContext';
import SideBar from '@/component/SideBar';
import styles from './layout.module.scss';
import { Content } from 'antd/es/layout/layout';

export default function UserPageLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  const { loginContext } = useAuth();

  /* Chỗ này phải gọi api get-user chứ không phải renew-token. 
    Nếu access-token expired mới gọi renew-token*/
  const refreshToken = async () => {
    try {
      const response = await fetch(`${process.env.API}/api/v1/auth/renew-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.error) {
        // fail
        console.log('fail : ' + data.error);
        router.push('/login');
      } else {
        //  success
        loginContext(data.data.user, data.data.accessToken);
        setLoadingPage(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <>
      <Layout className={styles.layout}>
        <SideBar className={styles['sidebar-frame']} />
        <Content className={styles['content-frame']}>
          {loadingPage ? <Loading height="100vh" /> : children}
        </Content>
      </Layout>
      {modal}
    </>
  );
}
