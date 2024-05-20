'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './page.module.scss';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { chatRoomContext } from '../layout';
import { getMessagesOfChatroom, sendMessage } from '@/services/chatService';
import { chatroom, message } from '@/type/type';
import EmojiPickerComponent from '@/component/EmojiPicker/EmojiPicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  pushChatroom,
  pushMessage,
  setMessages,
  setSelectedChatroom,
} from '@/store/slices/chatroom';

const MessagePage = ({ params }: { params: { id: string } }) => {
  // const [messages, setMessages] = useState<message[]>([]);
  // const { chatroom } = useContext(chatRoomContext);
  const selectedChatRoom = useSelector((state: RootState) => state.chatrooms.selectedChatroom);
  if (!selectedChatRoom) {
    return <></>;
  }

  const messageRef = useRef<HTMLDivElement>(null);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const fetchMessagesOfChatroom = async () => {
    const data: chatroom = await getMessagesOfChatroom(params.id);
    dispatch(setMessages({ roomId: selectedChatRoom?.roomId, messages: data.message }));
  };

  const onSendMessage = async () => {
    if (messageRef.current?.innerText) {
      const data: message = await sendMessage(params.id, messageRef.current?.innerText);
      messageRef.current.innerText = '';

      if (selectedChatRoom === null) {
        return;
      }

      if (selectedChatRoom.message?.length > 0) {
        dispatch(pushMessage({ roomId: selectedChatRoom.roomId, message: data }));
      } else {
        dispatch(pushChatroom(selectedChatRoom));
        dispatch(pushMessage({ roomId: selectedChatRoom.roomId, message: data }));
      }
    }
  };

  useEffect(() => {
    if (selectedChatRoom === null) {
      // get chatroom infomation and asign to selected chatroom
    }
    fetchMessagesOfChatroom();
  }, []);

  return (
    <div className={styles['content']}>
      <div className={styles['header']}>
        <div className={styles['left']}>
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
          <FontAwesomeIcon icon={faCircleInfo} size='2x' />
        </div>
      </div>
      <div className={styles['list-message']}>
        {selectedChatRoom.message?.map((message) => {
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
