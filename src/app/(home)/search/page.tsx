'use client';
import { useEffect, useRef, useState } from 'react';
import { Col, Input, Row } from 'antd';
import { useRouter } from 'next/navigation';
import { InputRef, SearchProps } from 'antd/es/input';

import Post from '@/component/Post';
import UserCard from '@/component/UserCard';
import { post, user } from '@/type/type';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuSelected } from '@/store/slices/app';
import { RootState } from '@/store';
import { add, remove } from '@/store/slices/search';

const { Search } = Input;

const pattern = /^#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+$/g;

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<user[]>([]);
  const [posts, setPosts] = useState<post[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const searchInputRef = useRef<InputRef | null>(null);

  const historyStored = useSelector((state: RootState) => state.search.history);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMenuSelected(1));
  }, []);

  useEffect(() => {
    setHistory(historyStored.filter((value) => value.includes(search)));
  }, [historyStored]);

  const handleSearch = async (value: string) => {
    dispatch(add(value.trim()));
    if (value.match(pattern)) {
      router.push(`/hashtag/${value.trim().substring(1)}`);
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.API}/api/v1/search?keyword=` + value.trim(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      const data = await response.json();

      if (data.error) {
        // fail
        setLoading(false);
      } else {
        //  success
        setLoading(false);
        setUsers(data.data.users);
        setPosts(data.data.posts);
        // searchInputRef.current?.blur();
        setShowHistory(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
    if (info?.source == 'input' && value.trim() !== '') {
      handleSearch(value);
    }
  };

  return (
    <div>
      <Row style={{ background: 'white', paddingTop: '30px' }}>
        <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }} lg={{ span: 12, offset: 6 }}>
          <Row>
            <Search
              ref={searchInputRef}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowHistory(true);
                setHistory(historyStored.filter((value) => value.includes(e.target.value)));
              }}
              placeholder='Tìm kiếm'
              allowClear
              enterButton
              onSearch={onSearch}
              size='large'
              loading={loading}
              autoFocus
              onFocus={() => {
                setShowHistory(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowHistory(false);
                }, 100);
              }}
            />
            <div
              className={`w-full relative ${(!showHistory || history.length === 0) && 'hidden'}`}
            >
              <div className='rounded-lg mt-1 p-1 shadow-xl border-1 absolute w-full z-1000 bg-white max-h-96 overflow-y-scroll'>
                {history.map((value, index) => (
                  <div
                    key={index}
                    className='hover:bg-gray-f2 rounded-md p-2 flex'
                    onClick={() => {
                      setSearch(value);
                      handleSearch(value);
                    }}
                  >
                    <div className='flex-1'>{value}</div>
                    <div
                      className=' hover:bg-gray-e6 w-5 h-5 flex justify-center items-center rounded-full cursor-pointer text-lg font-semibold'
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(remove(index));
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      ×
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Row>
          {users?.length > 0 && (
            <div style={{ background: 'white', padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>Người dùng</div>
              <Row gutter={[5, 5]}>
                {users.map((user) => {
                  return (
                    <Col xs={24} key={user.id}>
                      <UserCard user={user} />
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
          {posts?.length > 0 && (
            <div style={{ background: 'white', padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>Bài viết</div>
              {/* <div className="left w-6/12 pr-4"> */}
              {posts.map((post) => (
                <div key={post.postId}>
                  <Post post={post} />
                </div>
              ))}
              {/* </div> */}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
