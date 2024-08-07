export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  EMPTY = '',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  UNKNOWN = 'UNKNOWN',
}

export enum RelationshipProfile {
  SELF = 'SELF',
  STRANGER = 'STRANGER',
  PENDING = 'PENDING',
  INCOMMINGREQUEST = 'INCOMMINGREQUEST',
  FRIEND = 'FRIEND',
  BLOCK = 'BLOCK',
  BLOCKED = 'BLOCKED',
}

export enum notificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_ACCEPT = 'FRIEND_ACCEPT',
  MENTION_IN_COMMENT = 'MENTION_IN_COMMENT',
  MENTION_IN_POST = 'MENTION_IN_POST',
}

export enum postMode {
  PUBLIC = 'PUBLIC',
  FRIEND = 'FRIEND',
  PRIVATE = 'PRIVATE',
}
