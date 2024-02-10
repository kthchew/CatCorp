import { useState } from "react";
import axios from "axios"
import logo from "./img/temp.png"
import PropTypes from "prop-types";
import "./css/Login.css"

const API_URL = "http://localhost:3500"

export default function Login({setLoginTime}) {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [canvasAPIKey, setCanvasAPIKey] = useState("");
  const [logState, setLogState] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptLogin();
    alert("Username: " + username + " " + "Password: " + password);
  };


  const attemptLogin = async () => {
    setLoginTime(Date.now());

    if (logState === "login") {
      const temp = await axios.get(`${API_URL}/loginUser`, {
        params: {
          "username": username,
          "password": password
        }
      })
      console.log(temp)

    } else if (logState === "create") {
      try {
        const temp = await axios.get(`${API_URL}/registerAccount`, {
          params: {
            "username": username,
            "password": password
          }
        })
        localStorage.setItem("canvasAPIKey", canvasAPIKey)

        console.log(temp)
      } catch (e) {
        console.log("account creation failed")
      }
    }
  }

  const toggleLoginState = () => {
    if (logState === "login") {
      setLogState("create")
    } else {
      setLogState("login")
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
        {
          logState === "create" && <CanvasAPIKeyContainer keyVal={canvasAPIKey}
                                                          setKey={setCanvasAPIKey}/>
        }
        <button type="submit">{logState === "login" ? "Login" : "Create Account"}</button>
      </form>
      <div className="bottomForm">
        <div className="links">
          <button onClick={toggleLoginState}>{logState === "login" ? "New User?" : "Existing User?"}</button>
          <p>Forgot Password?</p>
        </div>
      </div>
      <small className="copyright">&copy; 2024 Cat Corporate</small>
    </div>
  );
}

function CanvasAPIKeyContainer({ keyVal, setKey }) {
  return (
    <div className="inputContainer">
      <p className="loginLabel">Canvas API Key</p>
      <input value={keyVal}
             onChange={(e) => setKey(e.target.value)}
             type="password"/>
    </div>
  )
}

CanvasAPIKeyContainer.propTypes = {
  keyVal: PropTypes.string,
  setKey: PropTypes.func
}
Login.propTypes = {
  setLoginTime: PropTypes.func
}