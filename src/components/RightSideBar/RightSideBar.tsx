import { useContext,  } from "react";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import "./RightSideBar.css";
import { AppContext } from "../../context/AppContext";

const RightSideBar = () => {

  const {chatUser, } = useContext(AppContext) as Context
  // const [msgImages, setMsgImages] = useState<message[]>([]);
  // useEffect(()=> {
  //   let temVar: message[] = []; // Explicitly declare an array of strings

  //   messages.map((msg: message | any) => {
  //     if (msg.image) {
  //       temVar.push(msg.image);
  //     }
  //   });
  //   setMsgImages(temVar);
  
  // },[messages])


  return  chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={  chatUser.userData.avartar || assets.monkey} alt="" />
        <h3>
          {chatUser.userData.name} 
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? 
          <img src={assets.green_dot} className="dot" alt="" />
          : null}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {/* {msgImages.map((url, index)=> (<img key={index} onClick={()=> window.open(url.image)} src={url.image} alt="" />))} */}
          {/* <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic1} alt="" /> */}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
  : 
  <div className="rs">
    <button onClick={() => logout()}>Logout</button>
  </div>
};

export default RightSideBar;
