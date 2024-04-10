import { useEffect, useState } from 'react'
import axios from 'axios'
import './css/App.css'
import Login from "./Login"
// import OptionButton from "./Option_Button"
import Store from './Store.jsx'; 
import StoreButton from "./img/UI/store_button.png";
import Rewards from "./Rewards"
import Checklist from "./Checklist.jsx"
import Cat from "./Cat"


axios.defaults.baseURL = 'http://localhost:3500';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

function App() {
  const [courses, setCourses] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(null); //canvas user id
  const [userData, setUserData] = useState(null); //from db
  const [apiKey, setApiKey] = useState("")
  const [overlay, setOverlay] = useState("login")
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight)

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
      gems earned
    ]
  ]
*/

  async function getCsrfToken() {
    try {
      const resp = await axios.get(`/`);
      axios.defaults.headers.common['X-CSRF-Token'] = resp.data.csrfToken;
    } catch (e) {
      console.error("Failed to get CSRF token");
    }
  }

  useEffect(() => {
    async function tryLoginAndCash() {
      try {
        await getCsrfToken();

        const cashResp = await axios.post(`/cashNewSubmissions`);
        const accInfoResp = await axios.get(`/getAccountInfo`);
        setUserData(accInfoResp.data.userData);
        setUserId(accInfoResp.data.userId);
        setCourses(cashResp.data.courses);
      } catch (e) {
        // no session yet - just ignore
      }
    }

    tryLoginAndCash();
  }, []);

  async function logout() {
    try {
      await axios.post(`/logout`);
      await getCsrfToken();
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
      console.log(courses)
      setOverlay("rewardsLogin")
    }
  }, [courses])

  useEffect(() => {
    const setDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener('resize', setDimensions)
  }, [])


  return (
    <div>
      {overlay == "login" ? 
        <Login apiKey={apiKey} setApiKey={setApiKey} setUserData={setUserData} setUserId={setUserId} setCourses={setCourses}/>
      : 
        <div>

          {
            overlay == "rewardsLogin" ? 
              <Rewards courses={courses} setOverlay={setOverlay} skip={true}/>
            : overlay == "rewards" ? 
              <Rewards courses={courses} setOverlay={setOverlay} skip={false}/>
            : overlay == "checklist" ? 
              <Checklist courses={courses} setOverlay={setOverlay}/>
            : overlay == "store" ? 
              <Store setOverlay={setOverlay} userData={userData} setUserData={setUserData}/>
            : <></>
          }

          <button onClick={() => logout()} style={{position:'absolute',bottom:0, right:0}}>Logout</button>
          
          <div>
            <div className='floor'></div>
            <div className='back'>
              <img src={StoreButton}></img>
              <img src={StoreButton} ></img>
              <img src={StoreButton} ></img>
            </div>
            <div className='backOverlay'>
              <img onClick={() => setOverlay('store')} src={StoreButton} style={{opacity:0}}></img>
              <img onClick={() => setOverlay('rewards')} src={StoreButton} style={{opacity:0}}></img>
              <img onClick={() => setOverlay('checklist')} src={StoreButton} style={{opacity:0}}></img>
            </div>
            <div className='wall'>
            </div>
          </div>

          <div>
            {
            userData.cats.map((cat, i) => {
              const deskWidth = 132;
              const deskHeight = 96;

              var desksPerRow = Math.floor((width * .86) / deskWidth)
              var desksPerCol = (Math.ceil(userData.cats.length / desksPerRow));
              
              var yCoord = deskHeight + height * .75 * (Math.floor(i / desksPerRow) / desksPerCol);
              var xCoord = (i % desksPerRow) * deskWidth
              var offset = ((width / height) * (yCoord - deskHeight)) % deskWidth - deskWidth

              return (
              <div key={i} style={{zIndex: 100000-i}}>
                <Cat eyes={cat.eyes} hat={cat.hat} pattern={cat.pattern} patX={cat.x} patY={cat.y} x={xCoord - offset} y={yCoord} z={100000-i}/>  
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
