// AppContext.tsx
import { createContext, useState,  useEffect } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext<Context | null>(null);
type AppContextProviderProps = {
  children: React.ReactNode;
};
const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [messagesId, setMessagesId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const [chatUser, setChatUser] = useState<any>(null);
  const [chatVisible, setChatVisible] = useState<boolean>(false);

  const loadUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData?.avatar && userData?.name) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      // =====>
      await updateDoc(userRef, {
        lastSeen: Date.now(),
      })
      setInterval(async () => {
        if (auth?.currentUser) { 
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 6000);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    // ======>
  }
  useEffect(()=> {
    if(userData){
      const chatRf = doc(db, 'chats', userData.id)
      const unsSub = onSnapshot(chatRf, async (res: any)=> {
        const chatItems = res.data()?.chatsData || [];
        if (Array.isArray(chatItems)) {
        }
        const temData = [];
        for(const item of chatItems ){
          const userRef = doc(db, 'users', item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          temData.push({...item, userData});
        }
        setChatData(temData.sort((a, b) => b.updated_at - a.updated_at))
      })
      return () => unsSub();
    }
  })

  const contextValue = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messagesId,
    setMessagesId,
    messages,
    chatUser,
    setChatUser,
    setMessages,
    chatVisible,
    setChatVisible
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
