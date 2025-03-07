import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { db, logout } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
const LeftSideBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const {
    userData,
    chatData,
    setChatUser,
    setMessagesId,
    chatUser,
    messagesId,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext) as Context;
  const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const input = e.target.value.trim().toLowerCase();
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(
          userRef,
          where("username", ">=", input),
          where("username", "<=", input + "\uf8ff")
        );
        const querySnap = await getDocs(q);

        if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
          let userExists = chatData.some(
            (chat: any) => chat.rId === querySnap.docs[0].id
          );

          if (!userExists) {
            setUser({
              id: querySnap.docs[0].id,
              ...querySnap.docs[0].data(),
            } as User);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const addChat = async () => {
    if (!user) return;
    const messagesResf = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessagesRef = doc(messagesResf);
      await setDoc(newMessagesRef, {
        createAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messagesId: newMessagesRef.id,
          lastMessage: "",
          rId: userData.id,
          updateAt: Date.now(),
          messageSeen: false,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messagesId: newMessagesRef.id,
          lastMessage: "",
          rId: user.id,
          updateAt: Date.now(),
          messageSeen: false,
        }),
      });

      const USnap = await getDoc(doc(db, "users", user.id));
      const uData = USnap.data();
      setChat({
        messagesId: newMessagesRef.id,
        lastMessage: "",
        rId: user.id,
        updateAt: Date.now(),
        messageSeen: true,
        userData: uData,
      });
      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      console.log(error);
    }
  };
  const setChat = async (item: any) => {
    setMessagesId(item.messagesId);
    setChatUser(item);

    try {
      const userChatRef = doc(db, "chats", userData.id);
      const userChatSnapshot = await getDoc(userChatRef);
      const userChatData: ChatDataUpdate =
        userChatSnapshot.data() as ChatDataUpdate;
      const chatIndex = userChatData.chatsData.findIndex(
        (c) => c.messagesId === item.messagesId
      );
      userChatData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatRef, {
        chatsData: userChatData.chatsData,
      });
      setChatVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser((prev: any) => ({
          ...prev,
          userData: { ...prev.userData, ...userData },
        }));
      }
    };
    updateChatUserData();
  }, [chatData]);
  return (
    <div className={`ls ${chatVisible ? "hides" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here"
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch ? (
          user ? (
            <div onClick={addChat} key={user.id} className="friends add-user">
              <img src={user.avartar || assets.monkey} alt="User Avatar" />
              <p>{user.name}</p>
            </div>
          ) : (
            <p className="no-results">No users found.</p>
          )
        ) : (
          chatData.map((Item: chatType, index: number) => (
            <div
              onClick={() => {
                setChat(Item);
              }}
              key={index}
              className={`friends ${
                Item.messageSeen || Item.messagesId == messagesId
                  ? " "
                  : "border"
              }`}
            >
              <img src={Item.userData.avartar || assets.monkey} alt="" />
              <div>
                <p>{Item.userData.name || "underfine"}</p>
                <span>{Item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
