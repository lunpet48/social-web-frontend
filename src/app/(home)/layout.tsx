'use client';
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from 'antd/es/layout/layout';

import Loading from '@/component/Loading';
import SideBar from '@/component/SideBar';
import { login } from '@/store/slices/authUser';
import styles from './layout.module.scss';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { chatroom, message } from '@/type/type';
import { pushChatroom, pushMessage } from '@/store/slices/chatroom';
import { RootState } from '@/store';
import { getOneChat } from '@/services/chatService';

export default function UserPageLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  const chatrooms = useSelector((state: RootState) => state.chatrooms.chatrooms);

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
        //  save user-info into redux
        dispatch(login({ user: data.data.user, accessToken: data.data.accessToken }));
        setLoadingPage(false);

        // connect to websocket
        const socket = new SockJS('http://localhost:8081/ws');
        const client = Stomp.over(socket);
        client.connect({ Authorization: `Bearer ${data.data.accessToken}` }, () => {
          client.subscribe('/user/notification', (notification) => {
            console.log('notification', notification.body);
          });

          client.subscribe('/user/chat', async (received) => {
            const message: message = JSON.parse(received.body);

            const existingChatroomIndex = chatrooms.findIndex(
              (room) => room.roomId === message.roomId
            );

            if (existingChatroomIndex !== -1) {
              dispatch(pushMessage(message));
            } else {
              const chatroom: chatroom = await getOneChat(message.roomId);
              dispatch(pushChatroom(chatroom));
            }
          });
        });
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
