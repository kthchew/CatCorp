import { useEffect, useState } from 'react'
import axios from 'axios'
import './css/App.css'
import Login from "./Login"
// import Rewards from "./Rewards"

axios.defaults.baseURL = 'http://localhost:3500';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

let initialUserData;
let initialUserId;
let initialCourses;
try {
  // TODO: Maybe this isn't the best place to put this; might move to an effect if we want to show loading indicators
  const csrfTokenResp = await axios.get(`/`);
  axios.defaults.headers.common['X-CSRF-Token'] = csrfTokenResp.data.csrfToken;
  const accInfoResp = await axios.get(`/getAccountInfo`);
  initialUserData = accInfoResp.data.userData;
  initialUserId = accInfoResp.data.canvasUserId;
  initialCourses = accInfoResp.data.courses;
} catch (e) {
  initialUserData = null;
  initialUserId = null;
  initialCourses = null;
}

function App() {
  const [courses, setCourses] = useState(initialCourses);
  const [userId, setUserId] = useState(initialUserId); //canvas user id
  const [userData, setUserData] = useState(initialUserData); //from db
  const [apiKey, setApiKey] = useState("")
  const [overlay, setOverlay] = useState("login")

//due_at, points_possible, has_submitted_submissions, name, 

/*
COURSE STORAGE - NEW MODEL
  [
    course id
    course name
    course assignments:
    [
      assignment id
      assignment name
      due date
      points possible
    ]
    new submissions:
    [
      assignment id
      assignment name
      unlock date
      due date
      points possible
      submission id
      submission date
      submission points
    ]
  ]
*/

  async function logout() {
    try {
      await axios.post(`/logout`);
      setUserData(null);
      setUserId(null);
      setCourses(null);
      setOverlay("login")
    } catch (e) {
      console.log("logout failed");
    }
  }


  useEffect(() => {
    if (courses) {
      setOverlay("home")
    }
  }, [courses])

  return (
    <div>
      {overlay == "login" ? 
      <Login apiKey={apiKey} setApiKey={setApiKey} setUserData={setUserData} setUserId={setUserId} setCourses={setCourses}/>
      :
        <div>
          <h3>Your cash: {userData.gems}</h3>
          {/* <Rewards courses={courses} userData={userData}/> */}
          <h1>Your course info {userId ? <>(UID: {userId})</> : <></>}</h1>
          {courses && courses.message != "No courses available" ? 
            courses.map((c) => {
              return <div key={c[0]}>
                <h3>{c[1]} - {c[0]}</h3>
                {c[2].map((a) => {
                  return <div key={a}>
                    <h4 style={{color:'lightgreen'}}>{a[1]} - {a[0]}</h4>
                  </div>
                })}
                {c[3].map((a) => {
                  return <div key={a}>
                    <h4 style={{color:'orange'}}>{a[1]} - {a[0]}</h4>
                  </div>
                })}
              </div>
              
        
            })
          : 
            <h2>Finishing up...</h2>
          }
          <button onClick={logout}>Logout</button>
        </div>
      }
      </div>
  )
}

export default App
