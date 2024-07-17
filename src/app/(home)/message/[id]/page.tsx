'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './page.module.scss';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import {
  getChats,
  getMessagesOfChatroom,
  markReadMessage,
  sendMessage,
} from '@/services/chatService';
import { chatroom, user } from '@/type/type';
import EmojiPickerComponent from '@/component/EmojiPicker/EmojiPicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { markReadChatRoom, setMessages, setSelectedChatroom } from '@/store/slices/chatroom';
import { formatDatetimeForMessage } from '@/utils';
import { useRouter } from 'next/navigation';
import { RelationshipProfile } from '@/type/enum';
import { fetchUserProfile } from '@/services/profileService';
import { setCountUnreadMessage } from '@/store/slices/app';

const MessagePage = ({ params }: { params: { id: string } }) => {
  const selectedChatRoom = useSelector((state: RootState) => state.chatrooms.selectedChatroom);

  const [blockStatus, setBlockStatus] = useState<RelationshipProfile>();

  const messageRef = useRef<HTMLDivElement>(null);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const router = useRouter();

  const countUnreadMessage = async () => {
    const data: chatroom[] = await getChats();
    let count = 0;
    data.forEach((room) => {
      if (!room.isRead) {
        count++;
      }
    });
    dispatch(setCountUnreadMessage(count));
  };
  const fetchUserStatus = async (userId: string) => {
    const user: user = await fetchUserProfile(userId);
    setBlockStatus(user.relationship);
  };

  const fetchMessagesOfChatroom = async () => {
    await markReadMessage(params.id);
    dispatch(markReadChatRoom(params.id));
    countUnreadMessage();
    const data: chatroom = await getMessagesOfChatroom(params.id);
    if (data.users.length === 2 && data.name) {
      fetchUserStatus(data.name);
    }
    dispatch(setSelectedChatroom(data));
  };

  const onSendMessage = async () => {
    if (messageRef.current?.innerText) {
      await sendMessage(params.id, messageRef.current?.innerText);
      messageRef.current.innerText = '';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        document.execCommand('insertHTML', false, '<br><br>');
        event.preventDefault();
      } else {
        event.preventDefault();
        onSendMessage();
      }
    }
  };

  useEffect(() => {
    fetchMessagesOfChatroom();
  }, []);

  if (!selectedChatRoom) {
    return <></>;
  }

  return (
    <div className={styles['content']}>
      <div className={styles['header']}>
        <div
          className={styles['left']}
          onClick={() => {
            if (!Array.isArray(selectedChatRoom?.image)) {
              router.push(`/profile/${selectedChatRoom.name}`);
            }
          }}
        >
          {Array.isArray(selectedChatRoom?.image) ? (
            <img
              src={`${
                selectedChatRoom?.image[0] ? selectedChatRoom.image[0] : '/default-avatar.jpg'
              }`}
              alt='avatar'
            />
          ) : (
            <img
              src={`${selectedChatRoom?.image ? selectedChatRoom?.image : '/default-avatar.jpg'}`}
              alt='avatar'
            />
          )}
          <div>{selectedChatRoom?.name}</div>
        </div>
        <div className={styles['right']}>
          {/* <FontAwesomeIcon icon={faCircleInfo} size='2x' /> */}
        </div>
      </div>
      <div className={styles['list-message']}>
        {selectedChatRoom.message?.map((message, index) => {
          return (
            <div key={index} className={styles['message-row']}>
              {message.sender.userId === currentUser.id ? (
                <div className={`${styles['message']} ${styles['self']} whitespace-pre-line	`}>
                  {message.message}
                  <div className={styles['time']}>
                    {formatDatetimeForMessage(message.createdAt)}
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={message.sender.avatar}
                    alt='avatar'
                    className='cursor-pointer'
                    onClick={() => {
                      router.push(`/profile/${message.sender.username}`);
                    }}
                  />
                  <div className={`${styles['message']} whitespace-pre-line	`}>
                    {message.message}
                    <div className={styles['time']}>
                      {formatDatetimeForMessage(message.createdAt)}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {blockStatus === null ? (
        <div className='py-3 text-center text-md'>Hiện không thể liên lạc với tài khoản này</div>
      ) : (
        <div className={styles['input-chat-section']}>
          <EmojiPickerComponent divRef={messageRef} />
          <div className={styles['input-chat-wrapper']}>
            <div
              ref={messageRef}
              contentEditable='true'
              onKeyDown={handleKeyDown}
              placeholder='Nhắn tin'
            />
            <div className={styles['padding-scroll']} />
          </div>

          <div className={styles['btn-send-message']} onClick={onSendMessage}>
            Gửi
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
