import { Button, Col, Dropdown, MenuProps, Modal, Row } from 'antd';
import React, { useState } from 'react';

import styles from './style.module.scss';
import { useRouter } from 'next/navigation';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  denyFriendRequest,
  sendFriendRequest,
  unblockUser,
} from '@/services/friendService';
import { user } from '@/type/type';
import { RelationshipProfile } from '@/type/enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const UserCard = ({ user }: { user: user }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ isSuccess: false, text: '' });

  const router = useRouter();

  const handleSendFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await sendFriendRequest(user.id);

      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã gửi lời mời' });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const HandleAcceptFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await acceptFriendRequest(user.id);

      const data = await response.json();

      if (!data.error) {
        //success
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã chấp nhận kết bạn' });
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const handleDenyFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await denyFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã từ chối' });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCancelFriendRequest = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await cancelFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã hủy yêu cầu' });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await deleteFriend(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã xóa' });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const HandleUnblockUser = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await unblockUser(user.id);

      if (response.status === 204) {
        //success
        setLoading(false);
        setStatus({ isSuccess: true, text: 'Đã bỏ chặn' });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const blockUser = async (targetId: string) => {
    const access_token = localStorage.getItem('token');
    const response = await fetch(`${process.env.API}/api/v1/relationship/blocklist`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetId: targetId,
      }),
    });
    setStatus({ isSuccess: true, text: 'Đã chặn' });
    return response;
  };

  const itemsDropdown: MenuProps['items'] = [
    {
      label: (
        <a
          style={{ fontSize: '16px' }}
          onClick={(e) => {
            confirm({
              title: 'Bạn có chắc muốn xóa?',
              icon: <ExclamationCircleFilled />,
              content: '',
              okText: 'Có',
              okType: 'danger',
              cancelText: 'Không',
              onOk() {
                handleDeleteFriend(e);
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          Xóa bạn bè
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a
          style={{ fontSize: '16px' }}
          onClick={() => {
            confirm({
              title: 'Bạn có chắc muốn chặn người dùng này?',
              icon: <ExclamationCircleFilled />,
              content: '',
              okText: 'Có',
              okType: 'danger',
              cancelText: 'Không',
              onOk() {
                blockUser(user.id);
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          Chặn
        </a>
      ),
      key: '1',
    },
  ];

  const renderAction = () => {
    switch (user.relationship) {
      case RelationshipProfile.STRANGER:
        return (
          <Button
            type='primary'
            onClick={(e) => {
              handleSendFriendRequest(e);
            }}
          >
            Kết bạn
          </Button>
        );
      case RelationshipProfile.INCOMMINGREQUEST:
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type='primary'
              onClick={(e) => {
                HandleAcceptFriendRequest(e);
              }}
            >
              Chấp nhận
            </Button>
            <Button
              style={{ color: '#ff0000', borderColor: '#ff0000' }}
              onClick={(e) => {
                handleDenyFriendRequest(e);
              }}
            >
              Từ chối
            </Button>
          </div>
        );
      case RelationshipProfile.PENDING:
        return (
          <Button
            type='primary'
            onClick={(e) => {
              handleCancelFriendRequest(e);
            }}
          >
            Hủy yêu cầu
          </Button>
        );
      case RelationshipProfile.FRIEND:
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']} placement='bottomRight'>
              <div className={styles['show-more-btn']}>
                <FontAwesomeIcon style={{ fontSize: '18px' }} icon={faEllipsis} />
              </div>
            </Dropdown>
          </div>
        );
      case RelationshipProfile.BLOCK:
        return (
          <Button
            style={{ color: '#ff0000', borderColor: '#ff0000' }}
            onClick={(e) => {
              HandleUnblockUser(e);
            }}
          >
            Bỏ chặn
          </Button>
        );

      default:
        return <></>;
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => {
        router.push(`/profile/${user.username}`);
      }}
    >
      <img src={`${user.avatar ? user.avatar : '/default-avatar.jpg'}`} alt='avatar' />

      <div className={styles['user-info']}>
        <div>{`${user.fullName}`}</div>
        <div>@{`${user.username}`}</div>
      </div>

      <div className={styles['action']}>
        {loading ? (
          <Col xs={24}>
            <Button style={{ width: '100%', background: '#efefef' }} disabled>
              Loading
            </Button>
          </Col>
        ) : status.isSuccess ? (
          <Col xs={24}>
            <Button style={{ width: '100%', background: '#04AA6D', color: 'white' }} disabled>
              {status.text}
            </Button>
          </Col>
        ) : (
          renderAction()
        )}
      </div>
    </div>
  );
};

export default UserCard;
