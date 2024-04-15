import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Cat from "./Cat";
import Rewards from "./Rewards";
import Store from "./Store";
import Checklist from "./Checklist";
import { getCsrfToken } from './utils';
import StoreButton from "./img/UI/store_button.png";

function Home({ userData, setUserData, courses, setCourses, overlay, setOverlay }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight)

  async function logout() {
    try {
      await axios.post(`/logout`);
      await getCsrfToken();
      setUserData(null);
      setCourses(null);
      setOverlay("login")
    } catch (e) {
      console.log("logout failed");
    }
  }

  useEffect(() => {
    const setDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    window.addEventListener('resize', setDimensions)
    return () => {
      window.removeEventListener('resize', setDimensions)
    }
  }, [])

  return (
    <div>
      {
      overlay == "rewards" ? 
        <Rewards courses={courses} setOverlay={setOverlay}/>
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
            <Cat leftEye={cat.leftEye} rightEye={cat.rightEye} hat={cat.hat} pattern={cat.pattern} patX={cat.x} patY={cat.y} x={xCoord - offset} y={yCoord} z={100000-i}/>
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
  )
}

export default Home

Home.propTypes = {
  userData: PropTypes.object,
  setUserData: PropTypes.func,
  courses: PropTypes.array,
  setCourses: PropTypes.func,
  overlay: PropTypes.string,
  setOverlay: PropTypes.func,
  getCsrfToken: PropTypes.func
}
