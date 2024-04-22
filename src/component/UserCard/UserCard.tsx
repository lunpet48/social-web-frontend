import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';

import styles from './style.module.scss';
import { useRouter } from 'next/navigation';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  denyFriendRequest,
  sendFriendRequest,
} from '@/services/friendService';
import { user } from '@/type/type';
import { RelationshipProfile } from '@/type/enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

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
    const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('token');

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

  const showMore = () => {};

  const renderAction = () => {
    switch (user.relationship) {
      case RelationshipProfile.STRANGER:
        return (
          <Button
            type="primary"
            onClick={(e) => {
              handleSendFriendRequest(e);
            }}
          >
            Kết bạn
          </Button>
        );
      case RelationshipProfile.INCOMMINGREQUEST:
        return (
          <>
            <Button
              type="primary"
              onClick={(e) => {
                HandleAcceptFriendRequest(e);
              }}
            >
              Chấp nhận
            </Button>
            <Button
              onClick={(e) => {
                HandleAcceptFriendRequest(e);
              }}
            >
              Từ chối
            </Button>
          </>
        );
      case RelationshipProfile.PENDING:
        return (
          <Button
            type="primary"
            onClick={(e) => {
              handleCancelFriendRequest(e);
            }}
          >
            Hủy yêu cầu
          </Button>
        );
      case RelationshipProfile.FRIEND:
        return (
          <div className={styles['show-more-btn']}>
            <FontAwesomeIcon
              style={{ fontSize: '18px' }}
              onClick={(e) => {
                e.stopPropagation();
                showMore();
              }}
              icon={faEllipsis}
            />
          </div>
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
      <img
        // style={{
        //   width: '60px',
        //   height: '60px',
        //   objectFit: 'cover',
        //   borderRadius: '50%',
        //   background: 'white',
        // }}
        src={`${user.avatar ? user.avatar : '/default-avatar.jpg'}`}
        alt="avatar"
      />

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
