import { useState } from "react";
import axios from "axios"
import logo from "./img/title.png"
import login_button from "./img/Login_Button.png"
import create_account from "./img/Create_Account.png"
import new_user from "./img/New_User.png"
import exist_user from "./img/Existing_User.png"
import PropTypes from "prop-types";
import "./css/Login.css"

const API_URL = "http://localhost:3500"
export default function Login({apiKey, setApiKey, setUserData, setUserId, setCourses}) {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [logState, setLogState] = useState("login");
  const [loginResponse, setLoginResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptLogin(logState);
    // alert("Username: " + username + " " + "Password: " + password);
  };


  const attemptLogin = async (method) => {
    if (method === "login") {
      try {
        const currentKey = localStorage.getItem("canvasAPIKey");
        setApiKey(currentKey);

        setLoginResponse(`Logging in user ${username}...`);

        const result = await axios.post(`${API_URL}/loginUser`, {
          username: username,
          password: password,
          apiKey: currentKey
        });

        console.log(result);
        
        setUserData(result.data.userData);
        setUserId(result.data.userId);
        setCourses(result.data.courses);
        console.log("logged in");

        
      } catch (e) {
        console.log(e.response.data.message);
        setLoginResponse(e.response.data.message);
      }

    } else if (logState === "create") {
      try {
        await axios.post(`${API_URL}/registerAccount`, {
          username: username,
          password: password
        })

        toggleLoginState();
        localStorage.setItem("canvasAPIKey", apiKey)
      } catch (e) {
        console.log("account creation failed") //TELL THE USER IF THE USERNAME IS TAKEN
      }
    }
  }

  const toggleLoginState = () => {
    if (logState === "login") {
      setLogState("create");
    } else {
      setLogState("login");
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
            <img src={logState == "login" ? login_button : create_account}/>
          </button>
        </div>
        <div className="copyright" style={{color: "red"}}>{loginResponse}</div>
      </form>
      <div className="bottomForm">
        <div className="links">
          <button onClick={() => toggleLoginState()}>
            <img src={logState == "login" ? new_user : exist_user}/>
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
  apiKey: PropTypes.string,
  setApiKey: PropTypes.func,
  setUserData: PropTypes.func,
  setUserId: PropTypes.func,
  setCourses: PropTypes.func
}