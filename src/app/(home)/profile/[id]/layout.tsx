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
import {
  faEllipsis,
  faGear,
  faLocationDot,
  faMars,
  faVenus,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

import styles from './layout.module.scss';
import ButtonWrapper from './ButtonWrapper';
import Loading from '@/component/Loading';
import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  deleteFriend,
  denyFriendRequest,
  getFriend,
  sendFriendRequest,
} from '@/services/friendService';
import { useRouter } from 'next/navigation';
import { chatroom, user } from '@/type/type';
import { Gender, RelationshipProfile } from '@/type/enum';
import LongUserCard from '@/component/LongUserCard';
import { changePassword } from '@/services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuSelected } from '@/store/slices/app';
import { RootState } from '@/store';
import { fetchUserProfile } from '@/services/profileService';
import tabs from './tabs';
import TabsContext from './context';
import { newChat } from '@/services/chatService';
import { setSelectedChatroom } from '@/store/slices/chatroom';
import AddReportModal from '@/component/AddReportModal/AddReportModal';
import { logout } from '@/store/slices/authUser';
import { removeAll } from '@/store/slices/search';
import { ExclamationCircleFilled } from '@ant-design/icons';
import UserNotFound from './UserNotFound';

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

interface IProfileLayout {
  params: { id: string };
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ProfileLayout = ({ params, children, modal }: IProfileLayout) => {
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
  const [friends, setFriends] = useState<user[]>([]);
  const [isOpenModalFriendList, setIsOpenModalFriendList] = useState(false);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false);
  const [inputs, setInputs] = useState(initChangePasswordForm);
  const [selectedTab, setSelectedTab] = useState(tabs[0].name);
  const [isOpenReportModal, setIsOpenReportModal] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [isBlockNotifyModalOpen, setIsBlockNotifyModalOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const { confirm } = Modal;

  const handleChangeInputChangePasswordForm = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async () => {
    setLoadingPage(true);
    const user = await fetchUserProfile(params.id);
    setUser(user);
    setLoadingPage(false);
  };

  useEffect(() => {
    fetchData();
    if (currentUser.username == params.id) {
      dispatch(setMenuSelected(7));
    }
  }, []);

  const goToMessage = async () => {
    const result: chatroom = await newChat([user.id]);
    dispatch(setSelectedChatroom(result));
    router.push(`/message/${result.roomId}`);
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
  const confirmDeleteFriend = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    confirm({
      title: 'Bạn có chắc muốn xóa?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        handleDeleteFriend(setLoading);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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

  const handleOpenChangePasswordModal = () => {
    setIsOpenModalChangePassword(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAll());
    router.push('/login');
  };

  const handleBlockUser = async (userId: string) => {
    const res = await blockUser(userId);
    if (res.status >= 200 && res.status < 300) {
      setIsBlockNotifyModalOpen(true);
    } else {
    }
  };

  const confirmBlockUser = async (userId: string) => {
    confirm({
      title: 'Bạn có chắc muốn chặn người dùng này?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        handleBlockUser(userId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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

  const itemsDropdownBlock: MenuProps['items'] = [
    {
      label: (
        <a
          style={{ fontSize: '16px' }}
          onClick={() => {
            confirmBlockUser(user.id);
          }}
        >
          Chặn
        </a>
      ),
      key: '0',
    },

    // {
    //   label: (
    //     <a
    //       style={{ fontSize: '16px' }}
    //       onClick={() => {
    //         setIsOpenReportModal(true);
    //       }}
    //     >
    //       Báo cáo người dùng
    //     </a>
    //   ),
    //   key: '1',
    // },
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

  const handleOkBlockNotifyModal = () => {
    router.push('/relationship');
  };

  if (loadingPage) {
    return <Loading height='100vh' />;
  }

  if (!user || !user.id) {
    return <UserNotFound />;
  }

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
                      <Link href='/profile/edit' className={styles['btn-edit-profile']}>
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
                      <ButtonWrapper onClick={confirmDeleteFriend} primary danger>
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

                  {user.relationship !== RelationshipProfile.SELF && (
                    <Dropdown
                      menu={{ items: itemsDropdownBlock }}
                      trigger={['click']}
                      placement='bottomRight'
                    >
                      <div style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon style={{ fontSize: '18px' }} icon={faEllipsis} />
                      </div>
                    </Dropdown>
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
          {tabs.map((tab) => {
            if (!(tab.private && user.relationship !== RelationshipProfile.SELF)) {
              return (
                <div
                  className={`${styles.tab} ${selectedTab === tab.name && styles['active']}`}
                  onClick={() => {
                    router.push(tab.href.replace('{username}', params.id));
                  }}
                >
                  {tab.name}
                </div>
              );
            }
          })}
        </div>
        <TabsContext.Provider value={{ setSelectedTab }}>{children}</TabsContext.Provider>
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
      {modal}
      <AddReportModal
        open={isOpenReportModal}
        setOpen={setIsOpenReportModal}
        targetId={user.id}
        reportType='USER'
      />
      {/* Modal notify blocked */}
      <Modal
        title={<div style={{ fontSize: '20px' }}>Bạn đã chặn {user.username}</div>}
        open={isBlockNotifyModalOpen}
        onOk={handleOkBlockNotifyModal}
        onCancel={handleOkBlockNotifyModal}
        footer={[
          <Button key='submit' type='primary' onClick={handleOkBlockNotifyModal}>
            Oke
          </Button>,
        ]}
      >
        <div style={{ fontSize: '18px' }}>
          {user.username} sẽ không thể:
          <ul style={{ marginLeft: '20px', fontSize: '16px' }}>
            <li style={{ listStyleType: 'disc' }}>Xem trang cá nhân của bạn</li>
            <li style={{ listStyleType: 'disc' }}>Xem bài viết của bạn</li>
            <li style={{ listStyleType: 'disc' }}>Nhắn tin cho bạn</li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default ProfileLayout;
