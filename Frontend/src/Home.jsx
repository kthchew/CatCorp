import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Cat from "./Cat";
import { getCsrfToken } from './utils';

function Home({ userData, setUserData, setCourses, setOverlay }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight)

  async function buyLootboxTest() {
    try {
      const lootboxResp = await axios.post(`/buyLootbox`, { lootboxID: "1" });
      setUserData({ ...userData, gems: userData.gems - lootboxResp.data.spent, cats: [...userData.cats, lootboxResp.data.cat] });
    } catch (e) {
      console.error("Purchase failed");
    }
  }

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
      <button onClick={() => logout()} style={{ position: 'absolute', bottom: 0, right: 0 }}>Logout</button>
      <button onClick={buyLootboxTest} style={{ zIndex: 99999999, position: 'absolute', bottom: 0, right: '10%' }}>Buy Lootbox 1</button>
      <button onClick={() => setOverlay("assignments")} style={{ zIndex: 99999999, position: 'absolute', bottom: 0, right: '20%' }}>View Assignments</button>
      <p style={{ zIndex: 99999999, position: 'absolute', bottom: '10%', right: 0 }}>Gems: {userData.gems}</p>
      <div>
        <div className='floor'></div>
        <div className='back'>
        </div>
        <div className='wall'>
        </div>
      </div>

      <div>
        {
          userData.cats.map(
            (cat, i) => {
              //note - we may want to make the page refresh on window resize
              const deskWidth = 132;
              const deskHeight = 96;

              var desksPerRow = Math.floor((width * .86) / deskWidth)
              var desksPerCol = (Math.ceil(userData.cats.length / desksPerRow));

              var yCoord = deskHeight + height * .75 * (Math.floor(i / desksPerRow) / desksPerCol);
              var xCoord = (i % desksPerRow) * deskWidth
              var offset = ((width / height) * (yCoord - deskHeight)) % deskWidth - deskWidth

              return (
                <div key={i} style={{ zIndex: 100000 - i }}>
                  <Cat eyes={cat.eyes} hat={cat.hat} pattern={cat.pattern} patX={cat.x} patY={cat.y} x={xCoord - offset} y={yCoord} z={100000 - i} />
                </div>
              )
            }
          )
        }
      </div>
    </div>
  )
}

export default Home

Home.propTypes = {
  userData: PropTypes.object,
  setUserData: PropTypes.func,
  setCourses: PropTypes.func,
  setOverlay: PropTypes.func,
  getCsrfToken: PropTypes.func
}
