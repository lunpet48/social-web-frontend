'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './layout.module.scss';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Button, Divider, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { createContext, useEffect, useState } from 'react';
import { chatroom, shortUser, user } from '@/type/type';
import { searchUser } from '@/services/searchService';
import { getChats, newChat } from '@/services/chatService';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface IContextProps {
  chatroom: chatroom;
}

export const chatRoomContext = createContext({} as IContextProps);

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
  const [chatrooms, setChatrooms] = useState<chatroom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<chatroom>();
  //modal new chat
  const [isShowNewChat, setIsShowNewChat] = useState(false);
  const [searchUserInput, setSearchUserInput] = useState('');
  const [resultSearchUsers, setResultSearchUsers] = useState<user[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<user[]>([]);
  const [filteredResults, setFilteredResults] = useState<user[]>([]);

  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.user.user);

  const extractChatroomNameAndAvatar = (chatroom: chatroom): chatroom => {
    if (chatroom.users.length == 2) {
      const targetUser: shortUser =
        chatroom.users[0].userId === currentUser.id ? chatroom.users[1] : chatroom.users[0];
      chatroom.name = targetUser.username;
      chatroom.image = targetUser.avatar;
    } else {
      if (!chatroom.name) {
        const filterdUserList = chatroom.users.filter((u) => u.userId !== currentUser.id);
        chatroom.name = `${filterdUserList[0].username}, ${filterdUserList[1].username},...`;
      }
      if (!chatroom.image) {
        const filterdUserList = chatroom.users.filter((u) => u.userId !== currentUser.id);
        chatroom.image = [filterdUserList[0].avatar, filterdUserList[1].avatar];
      }
    }
    return chatroom;
  };

  const fetchChatRoom = async () => {
    const result = await getChats();
    setChatrooms(
      result?.map((chatroom: chatroom) => {
        return extractChatroomNameAndAvatar(chatroom);
      })
    );
  };

  useEffect(() => {
    fetchChatRoom();
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
    const data: chatroom = await newChat(selectedUsers.map((u) => u.id));
    setSelectedChatRoom(extractChatroomNameAndAvatar(data));
    router.push(`/message/${data.roomId}`);
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

          {chatrooms && chatrooms.length > 0 ? (
            chatrooms.map((chatroom) => (
              <div
                key={chatroom.roomId}
                className={`${styles['chatroom']} ${
                  selectedChatRoom?.roomId === chatroom.roomId && styles['active']
                }`}
                onClick={() => {
                  setSelectedChatRoom(chatroom);
                  router.push(`/message/${chatroom.roomId}`);
                }}
              >
                {Array.isArray(chatroom.image) ? (
                  <>
                    <img src={chatroom.image[0]} alt='avatar' />
                  </>
                ) : (
                  <img src={chatroom.image} alt='avatar' />
                )}

                <div className={styles['user-info']}>
                  <div>{chatroom.name}</div>
                  <div>{`${chatroom.message[0].sender.username}: ${chatroom.message[0].message}`}</div>
                </div>
              </div>
            ))
          ) : (
            <div>Không có tin nhắn</div>
          )}
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
