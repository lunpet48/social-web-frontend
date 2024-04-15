import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import UserCard from '@/component/UserCard';
import Recommend from './Recommend';
import Loading from '@/component/Loading';
import { getIncomingRequest } from '@/services/friendService';
import { user } from '@/type/type';
import UserCardV2 from '@/component/UserCardV2';

const FriendRequest = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState<user[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIncomingRequest();
        const data = await response.json();
        if (!data.error) {
          //success
          setUsers(data.data);
          setLoadingPage(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  if (loadingPage) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>Lời mời kết bạn</div>
      <Row gutter={[18, 18]}>
        {users.map((user, index) => {
          return (
            <Col xs={24} md={12} key={index}>
              <UserCardV2 user={user} />
            </Col>
          );
        })}
      </Row>
      <Recommend />
    </div>
  );
};

export default FriendRequest;
