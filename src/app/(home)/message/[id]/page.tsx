'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './page.module.scss';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { chatRoomContext } from '../layout';
import { getMessagesOfChatroom, sendMessage } from '@/services/chatService';
import { chatroom, message } from '@/type/type';
import EmojiPickerComponent from '@/component/EmojiPicker/EmojiPicker';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const MessagePage = ({ params }: { params: { id: string } }) => {
  const [messages, setMessages] = useState<message[]>([]);
  const { chatroom } = useContext(chatRoomContext);

  const messageRef = useRef<HTMLDivElement>(null);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const fetchMessagesOfChatroom = async () => {
    const data: chatroom = await getMessagesOfChatroom(params.id);
    setMessages(data.message);
  };

  const onSendMessage = async () => {
    if (messageRef.current?.innerText) {
      const data: message = await sendMessage(params.id, messageRef.current?.innerText);
      messageRef.current.innerText = '';
      messages?.length > 0 ? setMessages((prev) => [data, ...prev]) : setMessages([data]);
    }
  };

  useEffect(() => {
    fetchMessagesOfChatroom();
  }, []);

  return (
    <div className={styles['content']}>
      <div className={styles['header']}>
        <div className={styles['left']}>
          {Array.isArray(chatroom.image) ? (
            <>
              <img src={chatroom.image[0]} alt='avatar' />
            </>
          ) : (
            <img src={chatroom.image} alt='avatar' />
          )}
          <div>{chatroom?.name}</div>
        </div>
        <div className={styles['right']}>
          <FontAwesomeIcon icon={faCircleInfo} size='2x' />
        </div>
      </div>
      <div className={styles['list-message']}>
        {messages?.map((message) => {
          return (
            <>
              {message.sender.userId === currentUser.id ? (
                <div className={styles['message-row']}>
                  <div className={`${styles['message']} ${styles['self']}`}>{message.message}</div>
                </div>
              ) : (
                <div className={styles['message-row']}>
                  <img src={message.sender.avatar} alt='avatar' />
                  <div className={`${styles['message']}`}>{message.message}</div>
                </div>
              )}
            </>
          );
        })}
      </div>
      <div className={styles['input-chat-section']}>
        <EmojiPickerComponent divRef={messageRef} />
        <div ref={messageRef} contentEditable='true' placeholder='Nhắn tin'></div>
        <div className={styles['btn-send-message']} onClick={onSendMessage}>
          Gửi
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
