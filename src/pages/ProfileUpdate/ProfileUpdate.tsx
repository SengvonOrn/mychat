import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import "./ProfileUpdate.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";
const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [preImage, setPreImages] = useState("");
  const [uid, setUid] = useState("");

  const context = useContext(AppContext);
  if (!context) {
    return;
  }
  const { setUserData } = context;
  const profileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // now not suport if have storage = !images
      if (!preImage && images) {
        toast.error("Please select an image to upload");
        return;
      }
      const docRef = doc(db, "users", uid);
      if (images) {
        const imgaUrl = await upload(images);
        setPreImages(imgaUrl);
        await updateDoc(docRef, {
          avatar: imgaUrl,
          bio: bio,
          name: name,
        });
        toast.success("Profile updated successfully!");
        // ========>
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
        // toast.success("Profile updated out images!");
        const snap = await getDoc(docRef);
        setUserData(snap.data());
        navigate("/chat");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      const userId = user.uid;
      setUid(userId);
      const docRef = doc(db, `users`, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.name) setName(userData.name);
        if (userData.bio) setBio(userData.bio);
        if (userData.avatar) setPreImages(userData.avatar);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="profile">
      <div className="profile-conainer">
        <form onSubmit={profileUpdate}>
          <div className="wraper">
            <h3>Hi! My friend</h3>
            <label htmlFor="avatar">
              {/* <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.files && e.target.files.length > 0
                  ? setImages(e.target.files[0])
                  : undefined;
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            /> */}
              <img
                src={images ? URL.createObjectURL(images) : assets.monkey}
                alt="Profile"
              />
              {/* uploaded profile images */}
            </label>
          </div>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBio(e.target.value)
            }
            value={bio}
            placeholder="Write profile bio"
          ></textarea>
          <button type="submit">Save</button>
        </form>
        {/* <img
          className="profile-pic"
          src={
            images
              ? URL.createObjectURL(images)
              : preImage
              ? preImage
              : assets.logo_icon
          }
          alt="Logo"
        /> */}
      </div>
    </div>
  );
};
export default ProfileUpdate;
