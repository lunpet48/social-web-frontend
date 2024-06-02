import { MediaType, notificationType } from './type/enum';
import { chatroom, notification, shortUser } from './type/type';
import { store } from '@/store';

export function checkMediaType(url: string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']; // Thêm các định dạng hình ảnh khác nếu cần
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov']; // Thêm các định dạng video khác nếu cần

  if (!url) {
    return MediaType.UNKNOWN;
  }
  const extension = url.toString().split('.').pop()?.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return MediaType.IMAGE;
  } else if (extension && videoExtensions.includes(extension)) {
    return MediaType.VIDEO;
  }

  return MediaType.IMAGE;
}

export const formatCaption = (caption: string) => {
  const regexTag = /#[a-zA-Z0-9]+/g;
  const regexMention = /@[a-zA-Z0-9]+/g;

  caption = caption.replace(
    regexTag,
    (tag) => `<a style="color: #1677ff;" href='/hashtag/${tag.slice(1)}'>${tag}</a>`
  );
  caption = caption.replace(
    regexMention,
    (mention) => `<a style="color: #1677ff;" href='/profile/${mention.slice(1)}'>${mention}</a>`
  );
  return <div dangerouslySetInnerHTML={{ __html: caption }}></div>;
};

export const extractChatroomNameAndAvatar = (chatroom: chatroom): chatroom => {
  const currentUser = store.getState().user.user;

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

export const extractNotifyContent = (notification: notification) => {
  notification.content =
    notification.notificationType === notificationType.FRIEND_REQUEST
      ? `Đã gửi cho bạn lời mời kết bạn`
      : notification.notificationType === notificationType.FRIEND_ACCEPT
      ? `${notification.actor.username} và bạn đã trở thành bạn bè`
      : notification.notificationType === notificationType.LIKE
      ? `${notification.actor.username} đã thích bài viết của bạn`
      : notification.notificationType === notificationType.COMMENT
      ? `Đã bình luận bài viết của bạn`
      : notification.notificationType === notificationType.MENTION
      ? `Đã nhắc đến bạn trong một bài viết`
      : '';

  return notification;
};