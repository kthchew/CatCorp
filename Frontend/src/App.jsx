import { useEffect, useState } from 'react'
import axios from 'axios'
import './css/App.css'
import Login from "./Login"
// import Rewards from "./Rewards"
import Cat from "./Cat"


axios.defaults.headers.post['Content-Type'] = 'application/json'; //is this needed in this file?

function App() {
  const [courses, setCourses] = useState(null);
  const [userId, setUserId] = useState(null); //canvas user id
  const [userData, setUserData] = useState(null); //from db
  const [apiKey, setApiKey] = useState(null)
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
      setOverlay("home")
    }
  }, [courses])


  return (
    <div>
      {overlay == "login" ? 
        <Login apiKey={apiKey} setApiKey={setApiKey} setUserData={setUserData} setUserId={setUserId} setCourses={setCourses}/>
      :
        <div>
          <div>
            <div className='floor'></div>
            <div className='back'></div>
            <div className='wall'></div>
          </div>

          <div>
            {
            userData.cats.toReversed().map((cat, i) => {
              var cols = window.innerWidth / 64;
              console.log(window.innerWidth)

              return (
              <div key={i}>
                <Cat eyes={cat.eyes} hat={cat.hat} pattern={cat.pattern} patX={cat.x} patY={cat.y} x={(132*i) % window.innerWidth} y={96*Math.floor((132*i) / window.innerWidth)}/>  
              </div>
              )
            })}
          </div>

          {/* <h3>Your cash: {userData.gems}</h3> */}
          {/* <Rewards courses={courses} userData={userData}/> */}
          {/* <h1>Your course info {userId ? <>(UID: {userId})</> : <></>}</h1> */}
          {/* {courses && courses.message != "No courses available" ? 
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
          } */}

      
        </div>
      }
      </div>

  )
}

export default App
