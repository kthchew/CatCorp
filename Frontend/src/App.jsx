import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Login from "./Login"

const API_URL = "http://localhost:3500"

function App() {
  const [courses, setCourses] = useState(null);
  const [userId, setUserId] = useState(null); //canvas user id
  const [userData, setUserData] = useState(null); //from db
  const [loginTime, setLoginTime] = useState(null);
  const [apiKey, setApiKey] = useState(null)

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
        points possible
          submission id
          submission date
          submission points
      ],
      ...
    ]
  ]
*/



  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`${API_URL}/getUser`, {
        params: {
          "canvas_api_token": apiKey
        }   
      })
      await setUserId(res.data.id)
      return res.data.id;
    }
  
    const handleClose = async (event) => {
      event.preventDefault();
      console.log(loginTime, userData.u.username)
      
      // TODO: check result?
      await axios.get(`${API_URL}/logout`, {
        params: {
          "user_id": userData.u.username,
          "login_time": loginTime
        }
      })
  
      return event.returnValue = 'Are you sure you want to close?';
    }

    window.addEventListener('beforeunload', (ev) => {handleClose(ev)});
    getUserData();
    return () => {window.removeEventListener('beforeunload', handleClose)} //unload
  }, [userData])


  useEffect(() => {
    console.log()

    const getCourseData = async () => {
      if (!userId) {return}
  
      const res = await axios.get(`${API_URL}/getCourses`, {
        params: {
          "canvas_api_token": apiKey
        }   
      })
  
      var newCourses = [];
      await Promise.all(res.data.map(async (c) => {
  
        var newAssignments = [];
        const assignments = await axios.get(`${API_URL}/getAssignments`, {
          params: {
            "canvas_api_token": apiKey,
            "course_id": c.id,
          }   
        })
        
        await Promise.all(assignments.data.map(async (a) => {
          var assignmentArray = [a.id, a.name, a.due_at];
          if (a.has_submitted_submissions) { 
            var submission = await axios.get(`${API_URL}/getSubmission`, {
              params: {
                "canvas_api_token": apiKey,
                "course_id": c.id,
                "assignment_id": a.id,
                "user_id": userId
              }   
            })
            submission = submission.data;
  
            assignmentArray = assignmentArray.concat([submission.id, submission.submitted_at, submission.score, a.points_possible])
          }
  
  
          newAssignments.push(assignmentArray)
        }))
  
  
        newCourses.push([c.id, c.name, newAssignments])
  
      }))
  
  
      console.log(newCourses)
      setCourses(newCourses);
    }

    getCourseData();
  }, [userId])


  return (
    <>
      <Login setLoginTime={setLoginTime} apiKey={apiKey} setApiKey={setApiKey} setUserData={setUserData}/>
      <h1>Your course info {userId ? <>(UID: {userId})</> : <></>}</h1>
      {courses && courses.message != "No courses available" ? 
        courses.map((c) => {
          return <div key={c[0]}>
            <h3>{c[1]} - {c[0]}</h3>
            {c[2].map((a) => {
              return <div key={a}>
                <h4 style={a.length > 3 ? (Date.parse(a[5]) > userData.lastLogout ? {color:'orange'} : {color:'lightgreen'}) : {}}>{a[1]} - {a[0]}</h4>
              </div>
            })}
          </div>
          
          
        })
      : 
        <h2>Loading...</h2>
      }
    </>
  )
}

export default App
