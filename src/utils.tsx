import { MediaType, notificationType } from './type/enum';
import { chatroom, comment, notification, shortUser } from './type/type';
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

  // if is self chat, just get itself name and img
  if (chatroom.users.length == 1) {
    const targetUser: shortUser = chatroom.users[0];
    chatroom.name = targetUser.username;
    chatroom.image = targetUser.avatar;
  }
  // if 1-1 chat, then just get opponent name and img
  else if (chatroom.users.length == 2) {
    const targetUser: shortUser =
      chatroom.users[0].userId === currentUser.id ? chatroom.users[1] : chatroom.users[0];
    chatroom.name = targetUser.username;
    chatroom.image = targetUser.avatar;
  }
  // if room chat
  else {
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
      : notification.notificationType === notificationType.MENTION_IN_POST
      ? `Đã nhắc đến bạn trong một bài viết`
      : notification.notificationType === notificationType.MENTION_IN_COMMENT
      ? `Đã nhắc đến bạn trong một bình luận`
      : '';

  return notification;
};

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (checkMediaType(url) === MediaType.IMAGE) {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (err) => {
        resolve({ width: 0, height: 0 });
      };
      img.src = url;
    } else if (checkMediaType(url) === MediaType.VIDEO) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };
      video.onerror = (err) => {
        resolve({ width: 0, height: 0 });
      };
      video.src = url;
    } else {
      resolve({ width: 0, height: 0 });
    }
  });
}

async function getDimensionsForUrls(urls: string[]): Promise<{ width: number; height: number }[]> {
  const promises = urls.map((url) => getImageDimensions(url));
  return Promise.all(promises);
}

export const calculateSliderHeight = async (
  fixedWidth: number | undefined,
  fixedHeight: number | undefined,
  files: string[]
) => {
  if (fixedHeight) {
    return `${fixedHeight}px`;
  }
  if (fixedWidth) {
    const dimensions = await getDimensionsForUrls(files);

    const adjustedDimensions = dimensions.map((dimension) => {
      const newHeight = (dimension.height / dimension.width) * fixedWidth;
      return { width: fixedWidth, height: newHeight || 0 };
    });

    const maxHeight = Math.max(...adjustedDimensions.map((dim) => dim.height));

    return `${Math.min(maxHeight, fixedWidth * 1.2)}px`;
  }

  return '100%';
};

export const calculateSliderWidth = async (
  fixedWidth: number | undefined,
  fixedHeight: number | undefined,
  files: string[]
) => {
  if (fixedWidth) {
    return `${fixedWidth}px`;
  }

  if (fixedHeight) {
    return `${fixedHeight}px`;
  }

  return '100%';
};

interface commentFiltered {
  rootComments: comment[];
  subComments: comment[];
}

export const extractComment = (comments: comment[]) => {
  const { rootComments, subComments }: commentFiltered = comments.reduce<commentFiltered>(
    (result, comment: comment) => {
      if (comment.repliedCommentId) {
        result.subComments.push(comment);
      } else {
        comment.subComments = [];
        result.rootComments.push(comment);
      }
      return result;
    },
    { rootComments: [], subComments: [] }
  );

  subComments.forEach((subComment) => {
    const rootComment = rootComments.find((root) => root.id === subComment.repliedCommentId);
    if (rootComment) {
      rootComment.subComments.push(subComment);
    }
  });

  return rootComments;
};

export function formatDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays <= 7) {
    return `${diffInDays} ngày trước`;
  } else {
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }
}

export const formatDatetimeForMessage = (datetimeString: string) => {
  const utcDate = new Date(datetimeString);

  const utcTime = utcDate.getTime();
  const offset = 7 * 60 * 60 * 1000;
  const date = new Date(utcTime + offset);

  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getUTCFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
