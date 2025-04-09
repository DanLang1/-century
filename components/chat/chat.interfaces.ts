export interface Chat {
  message: string;
}

export interface UserForm {
  username: string;
  avatar: string;
}

export interface UserInfo {
  username: string;
  avatar: string;
  id: string;
  anonymous?: boolean;
}

export interface Message {
  id: string;
  timestamp: string;
  message: string | null;
  sender_username: string;
  sender_avatar: string;
  sender_id: string;
  reactions?: ReactionDB[];
}
export interface ReactionDB {
  message_id: string;
  emoji: string;
  username: string;
  xatType?: boolean;
}

export interface Reaction {
  emoji: string;
  username: string;
  xatType: boolean;
  userId: string;
}

export interface ReactionValue {
  xatType: boolean;
  usernames: string[];
}
