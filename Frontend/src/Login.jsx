import { useState } from "react";
import logo from "./img/temp.png"
import "./css/Login.css"

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      //login API/function
      alert("Username: " + username + " " + "Password: " + password);
  };

  return (
    <div className="loginContainer">
      <img src={logo} alt="Cat Corporate" className="loginLogo"/>
      <h2 className="loginHeader">Welcome to Cat Corporate!!!</h2>
      <form onSubmit={(e)=> handleSubmit(e)}>
          <div className="inputContainer">
           <p className="loginLabel">Username</p>
             <input value={username}
             onChange={(e) => setUser(e.target.value)}
             type="text" />
          </div>
          <div className="inputContainer">
            <p className="loginLabel">Password</p>
            <input value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"/>
          </div>
          <div className="bottomForm">
            <button type="submit">Login</button>
            <div className="links">
              <p>New User?</p>
              <p>Forgot Password?</p>
              </div>
          </div>
      </form>
      <small className="copyright">&copy; 2024 Cat Corporate</small>
    </div>
  );
}
