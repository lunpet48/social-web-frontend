'use client';
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Content } from 'antd/es/layout/layout';

import Loading from '@/component/Loading';
import SideBar from '@/component/SideBar';
import { login } from '@/store/slices/authUser';
import styles from './layout.module.scss';

export default function UserPageLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  const dispatch = useDispatch();

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
        dispatch(login({ user: data.data.user, accessToken: data.data.accessToken }));
        setLoadingPage(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  if (loadingPage) return <Loading height='100vh' />;

  return (
    <>
      <Layout className={styles.layout}>
        <SideBar className={styles['sidebar-frame']} />
        <Content className={styles['content-frame']}>{children}</Content>
      </Layout>
      {modal}
    </>
  );
}
