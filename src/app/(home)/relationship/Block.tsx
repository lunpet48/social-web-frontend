import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Loading from '@/component/Loading';
import { getBlockList, getFriend } from '@/services/friendService';
import { user } from '@/type/type';
import UserCard from '@/component/UserCard';
import { RootState } from '@/store';

const Block = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState<user[]>([]);

  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBlockList();

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
      <div style={{ marginBottom: '20px' }}>Danh sách bạn bè ({users.length})</div>
      <Row gutter={[18, 18]}>
        {users.map((user, index) => {
          return (
            <Col xs={24} md={12} key={index}>
              <UserCard user={user} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Block;
