import ChatBox from "../../components/ChatBox/ChatBox";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { AppContext, } from "../../context/AppContext";
const Chat = () => {
  const { userData, chatData } = useContext(AppContext) as Context;
  const [loading, setloading] = useState(true)

  useEffect(()=> {
    if(chatData &&  loading){
      setloading(false)
    }
    
  }, [chatData, userData])

  
 
  return (
    <div className="chat">
      {
        loading ? <p className="loading">Loading...</p>
        :
        <div className="chat-contenner">
        <LeftSideBar />
        <ChatBox />
        <RightSideBar />
      </div>

      }
  
    </div>
  );
};

export default Chat;
