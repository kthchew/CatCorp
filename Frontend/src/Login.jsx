import { useState, useEffect } from "react";
import { Blocks } from "react-loader-spinner"
import axios from "axios"
import logo from "./img/UI/title.png"
import login_button from "./img/UI/Login_Button.png"
import create_account from "./img/UI/Create_Account.png"
import new_user from "./img/UI/New_User.png"
import exist_user from "./img/UI/Existing_User.png"
import PropTypes from "prop-types";
import "./css/Login.css"

import { getCsrfToken } from './utils';

export default function Login({onLoginDataReceived}) {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [logState, setLogState] = useState("login");
  const [loginResponse, setLoginResponse] = useState("");
  const [usingSession, setUsingSession] = useState(true);

  useEffect(() => {
    let ignore = false

    async function tryLogin() {
      try {
        await getCsrfToken();

        const accInfoResp = await axios.get(`/getAccountInfo`);
        if (!ignore) {
          onLoginDataReceived(accInfoResp.data.userData)
        }
      } catch (e) {
        // no session yet - just ignore
      } finally {
        setUsingSession(false)
      }
    }

    tryLogin();

    return () => {
      ignore = true
    }
  }, [onLoginDataReceived]);

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptLogin(logState);
    // alert("Username: " + username + " " + "Password: " + password);
  };


  const attemptLogin = async (method) => {
    if (method === "login") {
      try {
        if (localStorage.getItem("canvasAPIKey") == null) {
          localStorage.setItem("canvasAPIKey", apiKey);
        }
        const currentKey = localStorage.getItem("canvasAPIKey");
        setApiKey(currentKey);
        setLoginResponse(`Logging in user ${username}...`);

        await axios.post(`/loginUser`, {
          username: username,
          password: password,
          apiKey: currentKey
        });
        const accInfoResp = await axios.get(`/getAccountInfo`);
        
        onLoginDataReceived(accInfoResp.data.userData)
        console.log("logged in");
      } catch (e) {
        if (e.response) {
          console.log(e.response.data.message);
          setLoginResponse(e.response.data.message);
        } else {
          setLoginResponse(`Could not contact CatCorp/Canvas servers!`);
          console.log(`Could not contact CatCorp/Canvas servers!`);
        }
        localStorage.removeItem("canvasAPIKey");
      }

    } else if (logState === "create") {
      setLoginResponse(`Registering user ${username}...`);
      try {
        await axios.post(`/registerAccount`, {
          username: username,
          password: password
        })

        toggleLoginState();
        setLoginResponse(`Registered user ${username}`)
        localStorage.setItem("canvasAPIKey", apiKey)
      } catch (e) {
        console.log(e.response.data.message) //TELL THE USER IF THE USERNAME IS TAKEN
        setLoginResponse(e.response.data.message)
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

  if (usingSession) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <Blocks />
        <h1>Please wait...</h1>
      </div>
    )
  }

  return (
    <div className="loginContainer">
      <img src={logo} alt="Cat Corporate" className="loginLogo"/>
      <h2 className="loginHeader">Welcome to Cat Corp!</h2>
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
          (!localStorage.getItem("canvasAPIKey") || logState === 'create') && <CanvasAPIKeyContainer keyVal={apiKey}
                                                          setKey={setApiKey}/>
        }
        <div className="loginAccount">
          <button type="submit">
            <img src={logState == "login" ? login_button : create_account}/>
          </button>
        </div>
        <div className="loginError" style={{color: "red"}}>{loginResponse}</div>
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
  onLoginDataReceived: PropTypes.func
}