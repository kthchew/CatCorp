import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import floorTile from "./img/UI/floor.png";
import Cat from "./Cat";
import Rewards from "./Rewards";
import Store from "./Store";
import Checklist from "./Checklist";
import { getCsrfToken } from './utils';
import StoreButton from "./img/UI/store_button.png";
import upcomingButton from "./img/UI/assignment.png";
import logoutButton from "./img/UI/logout.png";
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
      <button onClick={() => logout()} style={{position:'absolute',top:0, right:0}}>
        <img src={logoutButton}></img>      
      </button>
      <div>
        <div className='floor'>
          <img src={floorTile} style={{width:'100%', height:'100%'}}></img>
        </div>
        <div className='back'>
          <img src={StoreButton} className="function"></img>
          <img src={StoreButton} className="function"></img>
          <img src={upcomingButton} className="function"></img>
        </div>
        <div className='backOverlay'>
          <img onClick={() => setOverlay('store')} src={StoreButton} title="Store" style={{opacity:0}}></img>
          <img onClick={() => setOverlay('rewards')} src={StoreButton} title="Check Reward"style={{opacity:0}}></img>
          <img onClick={() => setOverlay('checklist')} src={upcomingButton} title="Upcoming Assignment"style={{opacity:0}}></img>
        </div>
        <div className='wall'>
        </div>
      </div>

      <div>
        {
        userData.cats.filter((cat) => cat.alive == true).map((cat, i) => {
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
