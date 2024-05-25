'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './layout.module.scss';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Button, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { createContext, useEffect, useState } from 'react';
import { chatroom, user } from '@/type/type';
import { searchUser } from '@/services/searchService';
import { getChats, newChat } from '@/services/chatService';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { removeSelectedChatroom, setChatrooms, setSelectedChatroom } from '@/store/slices/chatroom';

interface IContextProps {
  chatroom: chatroom;
}

export const chatRoomContext = createContext({} as IContextProps);

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
  //modal new chat
  const [isShowNewChat, setIsShowNewChat] = useState(false);
  const [searchUserInput, setSearchUserInput] = useState('');
  const [resultSearchUsers, setResultSearchUsers] = useState<user[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<user[]>([]);
  const [filteredResults, setFilteredResults] = useState<user[]>([]);

  const router = useRouter();

  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.user);
  const chatrooms = useSelector((state: RootState) => state.chatrooms.chatrooms);
  const selectedChatRoom = useSelector((state: RootState) => state.chatrooms.selectedChatroom);

  const fetchChatRoom = async () => {
    const result = await getChats();

    dispatch(setChatrooms(result));
  };

  useEffect(() => {
    fetchChatRoom();
    dispatch(removeSelectedChatroom());

    return () => {
      dispatch(removeSelectedChatroom());
    };
  }, []);

  //when user input search user on modal new chat, delay 1 second after finish chat to call api
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const users: user[] = await searchUser(searchUserInput);
      setResultSearchUsers(users);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchUserInput]);

  useEffect(() => {
    setFilteredResults(
      resultSearchUsers.filter((user) => !selectedUsers.map((user) => user.id).includes(user.id))
    );
  }, [resultSearchUsers, selectedUsers]);

  const chat = async () => {
    const result: chatroom = await newChat(selectedUsers.map((u) => u.id));
    dispatch(setSelectedChatroom(result));
    router.push(`/message/${result.roomId}`);
    setIsShowNewChat(false);
  };
  return (
    <>
      <div className={styles['content']}>
        <div className={styles['left']}>
          <div className={styles['head']}>
            <div className={styles['title']}>Chats</div>
            <div
              className={styles['new-chat-btn']}
              onClick={() => {
                setIsShowNewChat(true);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} size='xl' />
            </div>
          </div>
          <Input
            placeholder='Tìm kiếm'
            prefix={<SearchOutlined style={{ color: '#666', fontSize: '18px' }} />}
          />
          <div className={styles['messageTabs']}>
            <div className={`${styles['tab']} ${styles['active']}`}>Tin nhắn</div>
            {/* <div className={styles['tab']}>Tin nhắn đang chờ</div> */}
          </div>
          <div className={styles['chatroom-list']}>
            {chatrooms && chatrooms.length > 0 ? (
              chatrooms.map((chatroom) => (
                <div
                  key={chatroom.roomId}
                  className={`${styles['chatroom']} ${
                    selectedChatRoom?.roomId === chatroom.roomId && styles['active']
                  }`}
                  onClick={() => {
                    dispatch(setSelectedChatroom(chatroom));
                    router.push(`/message/${chatroom.roomId}`);
                  }}
                >
                  {Array.isArray(chatroom.image) ? (
                    <img
                      src={`${chatroom.image[0] ? chatroom.image[0] : '/default-avatar.jpg'}`}
                      alt='avatar'
                    />
                  ) : (
                    <img
                      src={`${chatroom.image ? chatroom.image : '/default-avatar.jpg'}`}
                      alt='avatar'
                    />
                  )}

                  <div className={styles['user-info']}>
                    <div>{chatroom.name}</div>
                    <div>
                      {chatroom.message[0].sender.userId === currentUser.id ? 'Bạn: ' : ''}{' '}
                      {chatroom.message[0].message}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ paddingLeft: '20px' }}>Không có tin nhắn</div>
            )}
          </div>
        </div>
        <div className={styles['right']}>
          {selectedChatRoom && (
            <chatRoomContext.Provider value={{ chatroom: selectedChatRoom }}>
              {children}
            </chatRoomContext.Provider>
          )}
        </div>
      </div>
      <Modal
        open={isShowNewChat}
        footer={
          <Button
            type='primary'
            disabled={selectedUsers.length < 1}
            style={{ width: '100%' }}
            onClick={chat}
          >
            Nhắn tin
          </Button>
        }
        onCancel={() => {
          setIsShowNewChat(false);
        }}
        width={500}
        centered
      >
        <div className={styles['new-chat-modal']}>
          <div className={styles['title']}>Tin nhắn mới</div>
          <div className={styles['to']}>
            <label>Tới:</label>
            {selectedUsers.map((user) => (
              <div key={user.id} className={styles['selected-user']}>
                {user.fullName}{' '}
                <div
                  className={styles['close']}
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((seletedUser) => seletedUser.id != user.id)
                    )
                  }
                >
                  ×
                </div>
              </div>
            ))}
            <input
              style={{ flex: 1, minWidth: '50px' }}
              value={searchUserInput}
              onChange={(e) => setSearchUserInput(e.target.value)}
              placeholder='Tìm kiếm...'
            />
          </div>
          <div className={styles['people']}>
            {filteredResults.length > 0 ? (
              filteredResults.map((user) => (
                <div
                  key={user.id}
                  className={styles['user-card']}
                  onClick={() => {
                    setSelectedUsers((prev) => [...prev, user]);
                  }}
                >
                  <img src={`${user.avatar ? user.avatar : '/default-avatar.jpg'}`} alt='avatar' />
                  <div className={styles['user-info']}>
                    <div>{`${user.fullName}`}</div>
                    <div>@{`${user.username}`}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles['zero-result']}>
                <p>Không tìm thấy tài khoản</p>
                <p>Kết quả tìm kiếm sẽ hiển thị tại đây</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MessageLayout;
