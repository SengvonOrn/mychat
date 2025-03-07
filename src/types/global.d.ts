declare interface User {
  id: string;
  avartar: string;
  bio: string;
  createdAt: number;
  email: string;
  id: string;
  lastSeen: string;
  name: string;
  username: string;
}


declare interface ChatDataUpdate {
  chatsData: chatsData[];
}

declare interface chatType {
  lastMessage: string;
  messageSeen: boolean;
  messagesId: string;
  rId: string;
  updateAt: number;
  userData: userData;
}
declare interface Message {
  createdAt: Date;
}

declare interface chatsData {
  lastMessage: string;
  messageSeen: boolean;
  messagesId: string;
  rId: string;
  updateAt: string;
}

declare interface message{
  createdAt: Date;
  sId: string;
  text: string;
  image: string;
}

type userData = {
  avartar: string;
  bio: string;

  createdAt: Date;

  email: string;

  id: string;

  lastSeen: number;

  name: string;

  username: string;
};


declare interface Context {
  userData: any;
  setUserData: Dispatch<SetStateAction<any>>;
  chatData: any;
  setChatData: (chat: any) => void;
  messagesId: any;
  setMessagesId: (chatId: any) => void;
  messages: any;
  setMessages: (messages: any) => void;
  chatUser: any;
  setChatUser: (chatuser: any) => void;
    chatVisible: boolean;
    setChatVisible: (chatvisible: boolean) => void;
  loadUserData: (uid: string) => Promise<void>;
}
