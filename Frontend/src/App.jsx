import { useState } from 'react'
import axios from 'axios'
import './css/App.css'
import Login from "./Login"
// import Rewards from "./Rewards"
import Home from "./Home";
import {getCsrfToken} from "./utils.jsx";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3500';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

function App() {
  const [courses, setCourses] = useState(null);
  const [bossData, setBossData] = useState(null)
  const [userData, setUserData] = useState(null); //from db
  const [overlay, setOverlay] = useState("login")
  const [changedCats, setChangedCats] = useState([])
  const [changeType, setChangeType] = useState([])

  async function onLoginDataReceived(newUserData) {
    setUserData(newUserData)
    setOverlay("home")

    try {
      const cashResp = await axios.post(`/cashNewSubmissions`);
      setCourses(cashResp.data.courses);
      setBossData(cashResp.data.bossfights);
      newUserData.gems += cashResp.data.gainedGems
      setUserData(newUserData)

      let newSubmissionsExist = false
      for (let course of cashResp.data.courses) {
        if (course[3].length > 0) {
          newSubmissionsExist = true
          break
        }
      }
      if (newSubmissionsExist) {
        setOverlay("rewards")
      }

      const newChangeType = [...changeType]
      const newChangedCats = [...changedCats]
      const gainedCats  = []
      const lostCats = []
      for (const result of cashResp.data.bossResults) {
        if (result.result && result.result === "win") {
          newChangeType.push("won")
          newChangedCats.push([result.newCat])
          gainedCats.push(result.newCat)
        } else if (result.result && result.result === "lose") {
          newChangeType.push("lost")
          newChangedCats.push(result.lostCats)
          lostCats.push(...result.lostCats)
        }
      }

      // TODO: also update for lost cats. This is more difficult and we should
      // probably add IDs to cats.
      newUserData.cats.push(...gainedCats)
      setUserData(newUserData)

      setChangeType(newChangeType)
      setChangedCats(newChangedCats)
    } catch (e) {
      console.log("Failed to cash submissions");
    }
  }

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
    new submissions since last weekend:
    [(same as above)]
  ]
*/

  switch (overlay) {
    case "login":
      return <Login onLoginDataReceived={onLoginDataReceived}/>
    default:
      return <Home userData={userData} setUserData={setUserData} courses={courses} setCourses={setCourses} bossData={bossData} overlay={overlay} setOverlay={setOverlay} changedCats={changedCats} setChangedCats={setChangedCats} changeType={changeType} setChangeType={setChangeType} getCsrfToken={getCsrfToken}/>
  }
}

export default App
