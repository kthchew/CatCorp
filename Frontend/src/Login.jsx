import { useState } from "react";
import axios from "axios"
import logo from "./img/title.png"
import login_button from "./img/Login_Button.png"
import create_account from "./img/Create_Account.png"
import new_user from "./img/New_User.png"
import exist_user from "./img/Existing_User.png"
import PropTypes from "prop-types";
import leaderWindow from "./img/Leader.png"
import "./css/Login.css"

const API_URL = "http://localhost:3500"
var loginAcc = login_button
var userState = new_user
export default function Login({setLoginTime, apiKey, setApiKey, setUserData}) {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [logState, setLogState] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptLogin(logState);
    alert("Username: " + username + " " + "Password: " + password);
  };


  const attemptLogin = async (method) => {
    setLoginTime(Date.now());

    if (method === "login") {
      try {
        const temp = await axios.get(`${API_URL}/loginUser`, {
          params: {
            "username": username,
            "password": password
          }
        })

        setApiKey(localStorage.getItem("canvasAPIKey"))
        setUserData(temp.data)
      } catch (e) {
        console.log("login failed");
      }

    } else if (logState === "create") {
      try {
        const temp = await axios.get(`${API_URL}/registerAccount`, {
          params: {
            "username": username,
            "password": password
          }
        })
        localStorage.setItem("canvasAPIKey", apiKey)

        //LOG IN THE USER AS WELL
        await setLogState("login");
        attemptLogin("login"); //logState doesn't update by func call for some reason

      } catch (e) {
        console.log("account creation failed") //TELL THE USER IF THE USERNAME IS TAKEN
      }
    }
  }

  const toggleLoginState = () => {
    if (logState === "login") {
      setLogState("create")
      loginAcc = create_account
      userState = exist_user
    } else {
      setLogState("login")
      loginAcc = login_button
      userState = new_user
    }
  }

  return (
    <div className="loginContainer">
      <div className="leader">
        <button>
          {/* <img src={leaderWindow}/> */}
        </button>
      </div>
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
          logState === "create" && <CanvasAPIKeyContainer keyVal={apiKey}
                                                          setKey={setApiKey}/>
        }
        <div className="loginAccount">
          <button type="submit">
            <img src={loginAcc}/>
          </button>
        </div>
      </form>
      <div className="bottomForm">
        <div className="links">
          <button onClick={toggleLoginState}>
            <img src={userState}/>
          </button>
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
  setLoginTime: PropTypes.func,
  apiKey: PropTypes.string,
  setApiKey: PropTypes.func,
  setUserData: PropTypes.func
}