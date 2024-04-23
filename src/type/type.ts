import { Gender, RelationshipProfile } from './enum';

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

export type post = {
  postId: string;
  user: user;
  postType: string;
  postMode: string;
  caption: string;
  tagList: string[];
  files: string[];
  reactions: string[];
  createdAt: string;
  updatedAt?: string;
};

export type comment = {
  id: string;
  postId: string;
  userId: string;
  comment: string;
  mediaLink: string;
  createdAt: string;
  repliedCommentId: string;
};
