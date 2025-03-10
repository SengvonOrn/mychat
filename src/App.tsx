// App.tsx
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./context/AppContext";

const App = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  useEffect(() => {
    if (context) {
      const { loadUserData } = context;
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          navigate("/chat");
          // console.log(user)
          await loadUserData(user.uid);
        } else {
          navigate("/");
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
