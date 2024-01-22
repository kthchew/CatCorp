import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = "http://localhost:3500"

function App() {
  const [courseIds, setCourseIds] = useState([])

  const getCourses = async () => {
    const res = await axios.get(`${API_URL}/getCourses`, {
      params: {
        "canvas_api_token": "1016~yq9pdLLpNzxvv8av456xSyWIzCA5MWHdbjODqaPCG6F3g2c351rknG6Zkf99RDwr"
      }
    })
    setCourseIds(res.data.ids);
  }

  useEffect(() => {
    getCourses();
  }, [])


  return (
    <>
      <div>Your course IDs:</div>
      {courseIds.length != 0 ? 
        courseIds.map((id) => {
          return <div key={id}>{id}</div>
        })
      : 
        <div>Loading...</div>
      }
    </>
  )
}

export default App
