import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import "./ChatBox.css";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import { AuthError } from "firebase/auth";
import convertTimestamp from "../../helper";
import upload from "../../lib/upload";
const ChatBox = () => {
  const {
    userData,
    messagesId,
    chatUser,
    messages,
    setMessages,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext) as Context;
  const [input, setInput] = useState<string>("");

  const sentMessage = async () => {
    try {
      if (input && messages) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });
        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatRef);
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c: chatsData) => c.messagesId === messagesId
            );

            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updateAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userChatData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            // ====>
            userChatData.chatsData[chatIndex].messageSeen = false;
            // ====>
            await updateDoc(userChatRef, userChatData);
            chatsData: userChatData.chatsData;
          }
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as AuthError;
        toast.error(firebaseError.message);
      }
    }
    setInput("");
  };

  // ================>
  const sendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        toast.error("No file selected");
        return;
      } else {
        toast.success("File selected");
      }
      const fileUrl = await upload(file);
      if (!fileUrl) {
        toast.error("No messages ID");
        return;
      }

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c: chatsData) => c.messagesId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updateAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userChatData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatRef, userChatData);
            chatsData: userChatData.chatsData;
          }
        });
      }
    } catch (error) {
      toast.error("Error uploading file:");
    }
  };
  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res: any) => {
        setMessages(res.data().messages.reverse());
      });
      return () => unSub();
    }
  }, [messagesId]);
  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "hide" : ""}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avartar || assets.monkey} alt="" />
        <p>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img
          onClick={() => setChatVisible(false)}
          src={assets.arrow_icon}
          className="arrow"
          alt=""
        />
      </div>
      {/* ====== */}
      <div className="chat-msg">
        {messages.map((msg: message, index: number) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg["image"] ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
            {/* <p className="msg">{msg.text}</p> */}
            <div>
              <img
                src={
                  messages.sId === userData.id
                    ? userData.avartar
                    : chatUser.userData.avartar || assets.monkey
                }
                alt=""
              />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* ========= */}
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, images/jpg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sentMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? " " : " "}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Welcome To My chat</p>
    </div>
  );
};
export default ChatBox;
