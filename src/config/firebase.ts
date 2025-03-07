import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { AuthError } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDqD3Fqdtml-A7EXigCIs2OeLwcLwjJ2g8",
  authDomain: "chat-app-9d20e.firebaseapp.com",
  projectId: "chat-app-9d20e",
  storageBucket: "chat-app-9d20e.firebasestorage.app",
  messagingSenderId: "396242446590",
  appId: "1:396242446590:web:9972613ef47eff3a729daf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
const signup = async (username: string, email: string, password: string) => {
  try {
    // Create user with email & password in Firebase Authentication
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avartar: "",
      bio: "Hey there",
      createdAt: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatData:[]
    });
    // toast.success("User created successfully!");
  } catch (error) {
    console.error("Error signing up:", error);
    if(error instanceof Error){
      const firebaseError = error as AuthError;
      toast.error(firebaseError.code.split('/')[1].split('-').join(" "));
    }
  }
};
const login = async (email: string, password: string) => {
      try {
            await signInWithEmailAndPassword( auth,email, password);
            // toast.success("Logged in successfully!");
          
      } catch (error) {
            console.error("Error signing up:", error);
            if(error instanceof Error) {
                  const firebaseError = error as AuthError;
                  toast.error(firebaseError.code.split('/')[1].split('-').join(" "));
            }           
      }
}

const logout = async () => {
      try {
            await signOut(auth)
            // toast.success("Logged out successfully!");     
      } catch (error) {
            if(error instanceof Error){
                  const firebaseError = error as AuthError;
                  toast.error(firebaseError.code.split('/')[1].split('-').join(" "))
            }
            
      }
 
}

const resetPass =async (email: string) => {
  if (!email) {
    toast.error("Please enter your email address");
    return;
  }
  
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querSnap = await getDocs(q);
  
    if (querSnap.empty) {
      toast.error("No account found with this email address");
      return; 
    }
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent successfully!");
  } catch (error) {
    if (error instanceof Error) {
      const firebaseError = error as AuthError;
      toast.error(firebaseError.code.split("/")[1].split("-").join(" "));
    }
  }
  
}

export {signup, login, logout, auth, db, resetPass}