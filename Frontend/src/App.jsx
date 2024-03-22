import { useEffect, useState } from 'react'
import axios from 'axios'
import './css/App.css'
import Login from "./Login"
// import Rewards from "./Rewards"
import Home from "./Home";
import Assignments from './Assignments';

axios.defaults.baseURL = 'http://localhost:3500';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

function App() {
  const [courses, setCourses] = useState(null);
  const [userData, setUserData] = useState(null); //from db
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

  useEffect(() => {
    if (courses) {
      console.log(courses)
      setOverlay("rewardsLogin")
    }
  }, [courses])

  switch (overlay) {
    case "login":
      return <Login apiKey={apiKey} setApiKey={setApiKey} setUserData={setUserData} setOverlay={setOverlay} setCourses={setCourses}/>
    case "assignments":
      return <Assignments userData={userData} courses={courses} setOverlay={setOverlay} />
    default:
      return <Home userData={userData} setUserData={setUserData} courses={courses} setCourses={setCourses} overlay={overlay} setOverlay={setOverlay} />
  }
}

export default App
