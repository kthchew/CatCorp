import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = "http://localhost:3500"
const API_KEY = "1016~yq9pdLLpNzxvv8av456xSyWIzCA5MWHdbjODqaPCG6F3g2c351rknG6Zkf99RDwr"

function App() {
  const [courseIds, setCourseIds] = useState(null)

  const getCourses = async () => {
    const res = await axios.get(`${API_URL}/getCourses`, {
      params: {
        "canvas_api_token": API_KEY
      }   
    })
    console.log(res)
    setCourseIds(res.data);
  }

  useEffect(() => {
    getCourses();
  }, [])


  return (
    <>
      <h1>Your course info:</h1>
      {courseIds && courseIds.message != "No courses available" ? 
        courseIds.map((c) => {
          return <div key={c.id}>
            <h3>{c.name} - {c.id}</h3>

          </div>
          
          
        })
      : 
        <div>Loading...</div>
      }
    </>
  )
}

export default App
