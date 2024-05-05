'use client';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Image,
  Input,
  MenuProps,
  Modal,
  Row,
  message,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faLocationDot, faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

import styles from './page.module.scss';
import ButtonWrapper from './ButtonWrapper';
import Loading from '@/component/Loading';
import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  denyFriendRequest,
  getFriend,
  sendFriendRequest,
} from '@/services/friendService';
import PostProfileComponent from '@/component/PostProfileComponent';
import { useRouter } from 'next/navigation';
import { post, user } from '@/type/type';
import { Gender, RelationshipProfile } from '@/type/enum';
import LongUserCard from '@/component/LongUserCard';
import { changePassword } from '@/services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuSelected } from '@/store/slices/app';
import { RootState } from '@/store';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const initChangePasswordForm = { oldPassword: '', newPassword: '' };

const Profile = ({ params }: { params: { id: string } }) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [user, setUser] = useState<user>({
    id: '',
    username: '',
    email: '',
    isLocked: false,
    bio: '',
    avatar: '',
    fullName: '',
    friendCount: 0,
    postCount: 0,
    relationship: RelationshipProfile.STRANGER,
    gender: Gender.EMPTY,
    address: '',
    dateOfBirth: '',
  });
  const [posts, setPosts] = useState<post[]>([]);
  const [friends, setFriends] = useState<user[]>([]);
  const [isOpenModalFriendList, setIsOpenModalFriendList] = useState(false);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false);
  const [inputs, setInputs] = useState(initChangePasswordForm);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const router = useRouter();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleChangeInputChangePasswordForm = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserProfile = async () => {
        setLoadingPage(true);
        const response = await fetch(`${process.env.API}/api/v1/profile?id=${params.id}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setUser(data.data);
          setLoadingPage(false);
          return data.data;
        } else if (response.status === 401) {
          console.log('JWT expired');
        }
      };

      const fetchPost = async (userId: string) => {
        setLoadingPost(true);
        const response = await fetch(`${process.env.API}/api/v1/${userId}/posts`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setLoadingPost(false);
          setPosts(data.data);
        } else if (response.status === 401) {
          console.log('JWT expired');
        }
      };
      const user: user = await fetchUserProfile();
      await fetchPost(user.id);
    }
  };

  useEffect(() => {
    fetchData();
    if (currentUser.username == params.id) {
      dispatch(setMenuSelected(7));
    }
  }, []);

  const goToMessage = () => {
    alert('Tính năng này chưa có');
  };

  const handleCancelFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await cancelFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAcceptFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await acceptFriendRequest(user.id);

      const data = await response.json();

      if (!data.error) {
        //success
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const handleDenyFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await denyFriendRequest(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setLoading(true);
      const response = await deleteFriend(user.id);

      if (response.status >= 200 && response.status < 300) {
        //succcess
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const response = await sendFriendRequest(user.id);

      const data = await response.json();

      if (!data.error) {
        //success
        await fetchData();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchFriendList = async () => {
    try {
      const response = await getFriend(user.id);
      if (response.status === 200) {
        const data = await response.json();
        setFriends(data.data);
      }
    } catch (e) {}
  };

  const handleOpenFriendList = () => {
    fetchFriendList();
    setIsOpenModalFriendList(true);
  };

  const handleCancel = () => {
    setIsOpenModalFriendList(false);
  };

  const handleCancelModalChangePassword = () => {
    form.resetFields();
    setInputs(initChangePasswordForm);
    setIsOpenModalChangePassword(false);
  };

  if (loadingPage) {
    return <Loading height='100vh' />;
  }

  const handleOpenChangePasswordModal = () => {
    setIsOpenModalChangePassword(true);
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const itemsDropdown: MenuProps['items'] = [
    {
      label: (
        <a style={{ fontSize: '16px' }} onClick={handleOpenChangePasswordModal}>
          Đổi mật khẩu
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a style={{ fontSize: '16px' }} onClick={handleLogout}>
          Đăng xuất
        </a>
      ),
      key: '1',
    },
  ];

  const handleChangePassword = async () => {
    try {
      const response = await changePassword(inputs);
      if (response.status >= 200 && response.status < 300) {
        message.success('Đổi mật khẩu thành công');
        handleCancelModalChangePassword();
      } else {
        const payload = await response.json();
        message.error(payload.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className={styles['content']}>
        <div className={styles['background-image-wrapper']}>
          <Image
            width={'100%'}
            preview={{
              mask: <></>,
            }}
            src={`${user.bio ? user.bio : '/default-background.png'}`}
          />
        </div>

        <div className={styles['info-wrapper']}>
          <div className={styles['avatar-image-wrapper']}>
            <Image
              width={'100%'}
              preview={{
                mask: <></>,
              }}
              src={`${user.avatar ? user.avatar : '/default-avatar.jpg'}`}
            />
          </div>
          <div className={styles['info']}>
            <div className={styles['info-top-row']}>
              <div className={styles['info-top-row-left']}>
                <div style={{ fontSize: '30px' }}>{`${user.username}`}</div>
                <span>{`${user.fullName}`}</span>
              </div>
              <div className={styles['info-top-row-right']}>
                <div className={styles['action']}>
                  {/* If owner profile then can edit profile else only view & action on this user*/}
                  {user.relationship == RelationshipProfile.SELF ? (
                    <>
                      <Link href='edit' className={styles['btn-edit-profile']}>
                        Chỉnh sửa trang cá nhân
                      </Link>
                      <Dropdown
                        menu={{ items: itemsDropdown }}
                        trigger={['click']}
                        placement='bottomRight'
                      >
                        <div style={{ cursor: 'pointer' }}>
                          <FontAwesomeIcon
                            icon={faGear}
                            style={{ fontSize: '30px', color: '#444' }}
                          />
                        </div>
                      </Dropdown>
                    </>
                  ) : user.relationship == RelationshipProfile.PENDING ? (
                    <>
                      <ButtonWrapper onClick={handleCancelFriendRequest} primary danger>
                        Hủy yêu cầu
                      </ButtonWrapper>
                      <ButtonWrapper onClick={goToMessage} style={{ background: '#d8dadf' }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </>
                  ) : user.relationship == RelationshipProfile.INCOMMINGREQUEST ? (
                    <>
                      <ButtonWrapper onClick={handleAcceptFriendRequest} primary>
                        Chấp nhận
                      </ButtonWrapper>
                      <ButtonWrapper onClick={handleDenyFriendRequest} primary danger>
                        Từ chối
                      </ButtonWrapper>

                      <ButtonWrapper onClick={goToMessage} style={{ background: '#d8dadf' }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </>
                  ) : user.relationship == RelationshipProfile.FRIEND ? (
                    <>
                      <ButtonWrapper onClick={handleDeleteFriend} primary danger>
                        Xóa
                      </ButtonWrapper>
                      <ButtonWrapper onClick={goToMessage} style={{ background: '#d8dadf' }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </>
                  ) : user.relationship == RelationshipProfile.STRANGER ? (
                    <>
                      <ButtonWrapper onClick={handleSendFriendRequest} primary>
                        Thêm bạn bè
                      </ButtonWrapper>
                      <ButtonWrapper onClick={goToMessage} style={{ background: '#d8dadf' }}>
                        Nhắn tin
                      </ButtonWrapper>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <span>{`${user.postCount} bài viết`}</span>
                  <div
                    onClick={handleOpenFriendList}
                    style={{ cursor: 'pointer' }}
                  >{`${user.friendCount} bạn bè`}</div>
                </div>
              </div>
            </div>

            {(user.gender || user.address || user.dateOfBirth) && (
              <div>
                <span style={{ fontWeight: 600 }}>{`Giới thiệu`}</span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {user.gender && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {user.gender == Gender.MALE ? (
                        <FontAwesomeIcon icon={faMars} color='blue' style={{ width: '20px' }} />
                      ) : user.gender == Gender.FEMALE ? (
                        <FontAwesomeIcon icon={faVenus} color='red' style={{ width: '20px' }} />
                      ) : (
                        ''
                      )}

                      <div style={{ width: '120px' }}>Giới tính:</div>
                      <div>
                        {user.gender == Gender.MALE
                          ? 'Nam'
                          : user.gender == Gender.FEMALE
                          ? 'Nữ'
                          : ''}
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        color='#2666c0'
                        style={{ width: '20px' }}
                      />
                      <div style={{ width: '120px' }}>Sống tại:</div>
                      <div>{user.address}</div>
                    </div>
                  )}

                  {user.dateOfBirth && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FontAwesomeIcon
                        icon={faCalendar}
                        color='#4889f4'
                        style={{ width: '20px' }}
                      />

                      <div style={{ width: '120px' }}>Ngày sinh:</div>
                      <div>{dayjs(user.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider style={{ borderTop: '1px solid #dbdbdb', marginBottom: '-0.5px' }} />
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.active}`}>Bài viết</div>
          <div className={`${styles.tab}`}>Reels</div>
          <div className={`${styles.tab}`}>Album</div>
          {user.relationship == RelationshipProfile.SELF ? (
            <>
              <div className={`${styles.tab}`}>Đã lưu</div>
              <div className={`${styles.tab}`}>Đã thích</div>
            </>
          ) : (
            ''
          )}
        </div>
        {loadingPost ? (
          <Loading height='50px' />
        ) : (
          <Row gutter={[3, 3]}>
            {posts.map((post, id) => (
              <Col xs={8} key={id}>
                <PostProfileComponent
                  src={`${post.files[0]}`}
                  onClick={() => {
                    router.push(`/post/${post.postId}`, { scroll: false });
                  }}
                  likeNumber={post.reactions.length}
                  commentNumber={0}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Modal
        forceRender
        title='Danh sách bạn bè'
        open={isOpenModalFriendList}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ minHeight: '300px', maxHeight: '370px', overflow: 'auto' }}>
          {friends.length <= 0 ? (
            <div>Không có bạn bè nào để hiển thị</div>
          ) : (
            friends.map((user, index) => <LongUserCard key={index} user={user} />)
          )}
        </div>
      </Modal>

      <Modal
        forceRender
        title='Đổi mật khẩu'
        open={isOpenModalChangePassword}
        onCancel={handleCancelModalChangePassword}
        footer={null}
      >
        <div>
          <Form
            onFinish={handleChangePassword}
            form={form}
            autoComplete='off'
            {...formItemLayout}
            scrollToFirstError
          >
            <Form.Item
              name='oldPassword'
              label='Mật khẩu hiện tại'
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập mật khẩu hiện tại!',
                },
              ]}
              hasFeedback
            >
              <Input.Password
                name='oldPassword'
                value={inputs.oldPassword}
                onChange={handleChangeInputChangePasswordForm}
              />
            </Form.Item>

            <Form.Item
              name='newPassword'
              label='Mật khẩu mới'
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập mật khẩu mới!',
                },
              ]}
              hasFeedback
            >
              <Input.Password
                name='newPassword'
                value={inputs.newPassword}
                onChange={handleChangeInputChangePasswordForm}
              />
            </Form.Item>

            <Form.Item
              name='confirm'
              label='Nhập lại mật khẩu'
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Xác nhận lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Nhập lại mật khẩu không chính xác!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button size='large' type='primary' htmlType='submit'>
                Xác nhận
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
