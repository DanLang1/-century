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
  id: number | string;
  timestamp: string;
  message: string | null;
  profiles: {
    avatar: string;
    username: string;
    id: string;
  };
}
