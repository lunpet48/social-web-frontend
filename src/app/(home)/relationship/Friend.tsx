import { Col, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Loading from '@/component/Loading';
import { getFriend, searchFriend } from '@/services/friendService';
import { user } from '@/type/type';
import UserCard from '@/component/UserCard';
import { RootState } from '@/store';
import { SearchOutlined } from '@ant-design/icons';

const Friend = () => {
  const [searchFriendInput, setSearchFriendInput] = useState('');
  const [loadingPage, setLoadingPage] = useState(true);
  const [users, setUsers] = useState<user[]>([]);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const fetchData = async () => {
    try {
      const response = await getFriend(currentUser.id);

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

  useEffect(() => {
    if (searchFriendInput === '') {
      fetchData();
    } else {
      const delayDebounceFn = setTimeout(async () => {
        if (searchFriendInput !== '') {
          const result = await searchFriend(searchFriendInput);
          setUsers(result);
        }
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchFriendInput]);

  if (loadingPage) {
    return <Loading />;
  }

  return (
    <div>
      <div className='pb-3 pr-3 w-2/4'>
        <Input
          value={searchFriendInput}
          onChange={(e) => setSearchFriendInput(e.target.value)}
          placeholder='Tìm kiếm bạn bè'
          prefix={<SearchOutlined style={{ color: '#666', fontSize: '18px' }} />}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        {' '}
        {searchFriendInput !== '' ? 'Kết quả tìm kiếm' : 'Danh sách bạn bè'} ({users.length})
      </div>
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

export default Friend;
