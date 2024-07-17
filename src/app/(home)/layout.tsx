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
import { chatroom, message, notification, toastNotify } from '@/type/type';
import { pushChatroom, pushMessage } from '@/store/slices/chatroom';
import { RootState, store } from '@/store';
import { getChats, getOneChat } from '@/services/chatService';
import ToastNotification from '@/component/ToastNotification';
import { extractNotifyContent } from '@/utils';
import { setCountUnreadMessage, setCountUnreadNotify } from '@/store/slices/app';
import { getNotificationUnread } from '@/services/notification';

export default function UserPageLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [loadingPage, setLoadingPage] = useState(true);
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [notifyContent, setNotifyContent] = useState<toastNotify>();

  const router = useRouter();

  const chatrooms = useSelector((state: RootState) => state.chatrooms.chatrooms);
  const dispatch = useDispatch();

  const countUnreadMessage = async () => {
    const data: chatroom[] = await getChats();
    let count = 0;
    data.forEach((room) => {
      if (!room.isRead) {
        count++;
      }
    });
    dispatch(setCountUnreadMessage(count));
  };

  const countUnreadNotify = async () => {
    const data: notification[] = await getNotificationUnread();

    dispatch(setCountUnreadNotify(data.length));
  };

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
          client.subscribe('/user/notification', (received) => {
            const notification: notification = JSON.parse(received.body);
            console.log(notification);
            setNotifyContent({
              image: notification.actor.avatar,
              name: notification.actor.username,
              content: extractNotifyContent(notification).content || '',
            });
            setIsShowNotification(true);
            countUnreadNotify();
          });

          client.subscribe('/user/chat', async (received) => {
            const message: message = JSON.parse(received.body);

            // add message to chatroom
            const existingChatroomIndex = chatrooms.findIndex(
              (room) => room.roomId === message.roomId
            );

            if (existingChatroomIndex !== -1) {
              dispatch(pushMessage(message));
            } else {
              const chatroom: chatroom = await getOneChat(message.roomId);
              dispatch(pushChatroom(chatroom));
            }

            // toast notify if not focus in chatroom
            const selectedChatRoom = store.getState().chatrooms.selectedChatroom;
            if (message.roomId !== selectedChatRoom?.roomId) {
              setNotifyContent({
                image: message.sender.avatar,
                name: message.sender.username,
                content: message.message,
              });
              setIsShowNotification(true);
            }

            countUnreadMessage();
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
      {notifyContent && (
        <ToastNotification
          isShow={isShowNotification}
          setIsShow={setIsShowNotification}
          notifyContent={notifyContent}
        />
      )}
      {modal}
    </>
  );
}
