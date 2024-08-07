import { Gender, RelationshipProfile, notificationType } from './enum';

// dùng cho update profile
export type profile = {
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
};

export type user = {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  isLocked?: boolean;
  bio?: string;
  avatar?: string;
  fullName?: string;
  gender?: Gender;
  address?: string;
  dateOfBirth?: string;
  postCount?: number;
  friendCount?: number;
  relationship?: RelationshipProfile;
};

/*
 * Dùng cho các trường hợp user chỉ cần thông tin id, user và avatar
 * như user có trong bài viết, comment ...
 * */
export type shortUser = {
  userId: string;
  username: string;
  avatar: string;
};

export type post = {
  postId: string;
  user: shortUser;
  postType: string;
  postMode: string;
  caption: string;
  tagList: string[];
  files: string[];
  reactions: string[];
  createdAt: string;
  updatedAt?: string;
  saved: boolean;
  album: album;
};

export type comment = {
  id: string;
  postId: string;
  user: {
    userId: string;
    username: string;
    avatar: string;
  };
  comment: string;
  mediaLink: string;
  createdAt: string;
  repliedCommentId: string;
  subComments: comment[];
};

export type notification = {
  id: string;
  actor: shortUser;
  receiver: string;
  notificationType: notificationType;
  idType: string;
  createdAt: string;
  content?: string;
  status?: string;
};

export type message = {
  messageid: string;
  roomId: string;
  sender: shortUser;
  message: string;
  mediaLink: string;
  createdAt: string;
};

export type chatroom = {
  roomId: string;
  users: shortUser[];
  message: message[];
  image?: string | string[];
  name?: string;
  isRead?: boolean;
};

export type toastNotify = {
  image: string;
  name: string;
  content: string;
};

export type paging = {
  pageNo: number;
  pageSize: number;
};

export type album = {
  id: string;
  name: string;
  img?: string;
};
