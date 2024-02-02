import { useState } from "react";
import axios from "axios"
import logo from "./img/temp.png"
import bcrypt from "bcryptjs"
import "./css/Login.css"

const API_URL = "http://localhost:3500"
const saltRounds = 10;

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [logState, setLogState] = useState("login");

  const handleSubmit = (e) => {
      e.preventDefault();
      attemptLogin();
      alert("Username: " + username + " " + "Password: " + password);
  };


  const attemptLogin = async () => {
    if (logState == "login") {
      const temp = await axios.get(`${API_URL}/loginUser`, {
        params: {
          "username": username,
          "password": password
        }   
      })
      console.log(temp)

    } else if (logState == "create") {
      
    }
  }

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
