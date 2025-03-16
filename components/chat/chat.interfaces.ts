export interface Chat {
  message: string;
}

export interface Message {
  message: string;
  user: UserInfo;
  timestamp: string;
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
