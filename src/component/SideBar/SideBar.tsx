import { Badge, Menu, MenuProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sider from 'antd/es/layout/Sider';
import {
  BellOutlined,
  HomeOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import CreatePost from '../CreatePost';
import { RootState } from '@/store';
import { setCountUnreadMessage, setCountUnreadNotify, setMenuSelected } from '@/store/slices/app';
import { getNotificationUnread } from '@/services/notification';
import { chatroom, notification } from '@/type/type';
import { getChats } from '@/services/chatService';

const SideBar = ({ className }: { className?: string }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.user);
  const notifyBadge = useSelector((state: RootState) => state.app.countUnreadNotify);
  const messageBadge = useSelector((state: RootState) => state.app.countUnreadMessage);
  const { currentKey, previousKey } = useSelector((state: RootState) => state.app.menuSelected);

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

  const labelContents = [
    'Trang chủ',
    'Tìm kiếm',
    'Reels',
    'Bạn bè',
    'Tin nhắn',
    'Thông báo',
    'Tạo bài viết',
    'Trang cá nhân',
  ];
  const items: MenuProps['items'] = [
    HomeOutlined,
    SearchOutlined,
    PlayCircleOutlined,
    TeamOutlined,
    MessageOutlined,
    BellOutlined,
    PlusOutlined,
    UserOutlined,
  ].map((Icon, index) => {
    let MenuIcon = <Icon style={{ fontSize: '25px', marginRight: '8px' }} />;
    if (index === 4) {
      MenuIcon = (
        <Badge count={messageBadge} size='small'>
          <Icon style={{ fontSize: '25px', marginRight: '8px' }} />
        </Badge>
      );
    } else if (index === 5) {
      MenuIcon = (
        <Badge count={notifyBadge} size='small'>
          <Icon style={{ fontSize: '25px', marginRight: '8px' }} />
        </Badge>
      );
    }

    return {
      key: String(index),
      icon: MenuIcon,
      label: (
        <span className='noselect' style={{ fontSize: '16px' }}>
          {labelContents[index]}
        </span>
      ),
      style: { margin: '0px 0px 15px 4px', padding: '0px 0px 0px 18px' },
      onClick: () => {
        dispatch(setMenuSelected(index));
        switch (index) {
          case 0:
            router.push('/');
            break;
          case 1:
            router.push('/search');
            break;
          case 2:
            router.push('/reels');
            break;
          case 3:
            router.push('/relationship');
            break;
          case 4:
            router.push('/message');
            break;
          case 5:
            router.push('/notification');
            break;
          case 6:
            setShowCreatePost(true);
            break;
          case 7:
            router.push('/profile/' + currentUser.username);
        }
      },
    };
  });

  useEffect(() => {
    if (currentKey !== previousKey && showCreatePost === false) {
      dispatch(setMenuSelected(previousKey));
    }
  }, [showCreatePost]);

  useEffect(() => {
    countUnreadNotify();
    countUnreadMessage();
  }, []);

  return (
    <Sider
      width={300}
      className={className}
      theme='light'
      breakpoint='xl'
      collapsedWidth='70px'
      style={{
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        borderRight: '1px solid #dcdcdc',
      }}
    >
      <div style={{ margin: '50px 10px' }}>
        <Link href={'/'} className='text-decoration-none'>
          <Space size={'large'}>
            <span
              style={{
                color: '#000000',
                fontSize: '30px',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <img style={{ height: '50px' }} src='/logo.jpg' alt='logo' />
              Sunny
            </span>
          </Space>
        </Link>
      </div>
      <Menu theme='light' mode='inline' selectedKeys={[currentKey.toString()]} items={items} />
      <CreatePost open={showCreatePost} setOpen={setShowCreatePost} />
    </Sider>
  );
};

export default SideBar;
