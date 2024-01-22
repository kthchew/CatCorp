import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = "http://localhost:3500"
const API_KEY = "1016~yq9pdLLpNzxvv8av456xSyWIzCA5MWHdbjODqaPCG6F3g2c351rknG6Zkf99RDwr"

function App() {
  const [courses, setCourses] = useState(null);
  const [userId, setUserId] = useState(null);

//due_at, points_possible, has_submitted_submissions, name, 


  const getCourseData = async () => {
    const res = await axios.get(`${API_URL}/getCourses`, {
      params: {
        "canvas_api_token": API_KEY
      }   
    })

    var newCourses = [];
    await Promise.all(res.data.map(async (c) => {

      var newAssignments = [];
      const assignments = await axios.get(`${API_URL}/getAssignments`, {
        params: {
          "canvas_api_token": API_KEY,
          "course_id": c.id,
        }   
      })
      assignments.data.ids.map((a) => {
        newAssignments.push(a.id)
      })
      newCourses.push([c.id, c.name, newAssignments])

    }))


    console.log(newCourses)
    setCourses(newCourses);
  }

  const getUserData = async () => {
    const res = await axios.get(`${API_URL}/getUser`, {
      params: {
        "canvas_api_token": API_KEY
      }   
    })
    // console.log(res)
    setUserId(res.data.id)
  }

  useEffect(() => {
    getCourseData();
    getUserData();
  }, [])


  return (
    <>
      <h1>Your course info {userId ? <>(UID: {userId})</> : <></>}</h1>
      {courses && courses.message != "No courses available" ? 
        courses.map((c) => {
          return <div key={c[0]}>
            <h3>{c[1]} - {c[0]}</h3>
            {c[2].map((a) => {
              return <div key={a}>
                <h4>{a}</h4>
              </div>
            })}
          </div>
          
          
        })
      : 
        <div>Loading...</div>
      }
    </>
  )
}

export default App
