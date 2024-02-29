import { useEffect, useState } from 'react'
import axios from 'axios'
import './css/App.css'
import Login from "./Login"
import Rewards from "./Rewards"

const API_URL = "http://localhost:3500"

axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  const [courses, setCourses] = useState(null);
  const [userId, setUserId] = useState(null); //canvas user id
  const [userData, setUserData] = useState(null); //from db
  const [loginTime, setLoginTime] = useState(null);
  const [apiKey, setApiKey] = useState(null)
  const [apiLoad, setApiLoad] = useState([0, 0])
  const [overlay, setOverlay] = useState("login")

//due_at, points_possible, has_submitted_submissions, name, 

/*  HOW ARE COURSES STORED?
  [
    course id
    course name
    course assignments: [ assignments BEFORE last login aren't used. Ones that have been submitted have additional info (indented terms)
      [ 
        assignment id
        assignment name
        due date
          submission id
          submission date
          submission points
          points possible
      ],
      ...
    ]
  ]
*/

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
    new  submissions:
    [
      assignment id
      assignment name
      due date
      points possible
      submission id
      submission date
      submission points
    ]
  ]
*/


  // useEffect(() => {
  //   setApiLoad([1, 0])


  //   const handleClose = async (event) => {
  //     event.preventDefault();
      
  //     // TODO: check result?
  //     await axios.get(`${API_URL}/logout`, {
  //       params: {
  //         "user_id": userData.username,
  //         "login_time": loginTime
  //       }
  //     })
  
  //     return event.returnValue = 'Are you sure you want to close?';
  //   }

  //   window.addEventListener('beforeunload', (ev) => {handleClose(ev)});
  //   return () => {window.removeEventListener('beforeunload', handleClose)} //unload
  // }, [userData])


  // useEffect(() => {

  //   const getCourseData = async () => {
  //     if (!userId) {return}

  //     setOverlay(null)
  

  
  
  //     console.log(newCourses)
  //     console.log(userData)
  //     setCourses(newCourses);
  //   }

  //   getCourseData();
  // }, [userId])


  return (
    <div>
      {overlay == "login" ? 
      <Login setLoginTime={setLoginTime} apiKey={apiKey} setApiKey={setApiKey} setUserData={setUserData} setUserId={setUserId} setCourses={setCourses}/>
      : apiLoad[0] == 1 ? 
      <div>Loading Canvas user...</div>
      : apiLoad[0] == 2 ? 
      <div>Loading courses...</div>
      : apiLoad[0] == 3 ? 
      <div>Loading assignments... {apiLoad[1].toFixed(2) * 100}%</div>
      :
        <div>
          <h3>Your cash: {userData.gems}</h3>
          <Rewards courses={courses} userData={userData}/>
          <h1>Your course info {userId ? <>(UID: {userId})</> : <></>}</h1>
          {courses && courses.message != "No courses available" ? 
            courses.map((c) => {
              return <div key={c[0]}>
                <h3>{c[1]} - {c[0]}</h3>
                {c[2].map((a) => {

                  return <div key={a}>
                    <h4 style={a.length > 3 ? (Date.parse(a[4]) > userData.lastLogin ? {color:'orange'} : {color:'lightgreen'}) : {}}>{a[1]} - {a[0]}</h4>
                  </div>
                })}
              </div>
              
              
            })
          : 
            <h2>Finishing up...</h2>
          }
        </div>
      }
      </div>
  )
}

export default App
