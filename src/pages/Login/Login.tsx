import "./Login.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { signup, login, resetPass } from "../../config/firebase";
const Login = () => {
  const [currenState, setCurrentState] = useState<string>("Sign up");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currenState === "Sign up") {
      signup(username, email, password);
    } else {
      login(email, password);
    }
  };
  return (
    <div className="login">
      <img src={logo} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currenState}</h2>
        {currenState === "Sign up" ? (
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            value={username}
            type="text"
            placeholder="username"
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          value={email}
          type="text"
          placeholder="Email address"
          className="form-input"
          required
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          value={password}
          type="Password"
          placeholder="Password"
          className="form-input"
        />
        <button type="submit">
          {currenState === "Sign up" ? "Create account" : "Login now"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forget">
          {currenState === "Sign up" ? (
            <p className="login-toggle">
              Already have an Account
              <span onClick={() => setCurrentState("Login")}> login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create An account
              <span onClick={() => setCurrentState("Sign up")}>
               {" "} create here
              </span>
            </p>
          )}
          {currenState === "Login" ? (
            <p className="login-toggle">
              Forgot Password?
              <span onClick={() => resetPass(email)}> Reset here </span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};
export default Login;
