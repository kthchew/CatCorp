import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./css/Rewards.css"
import gem from "../src/img/gem.png"

export default function Rewards({courses, setOverlay}) {
  const [subArr, setSubArr] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    var subs = []

    courses.forEach((c) => {
      if (c[2].length > 0) {
        subs.push([c[1], c[2]]);
      }
    })

    setSubArr(subs)
  }, [courses])

  return (
    <div>
      {subArr ? <div className="rewardsBackground">
        <h1 className="rewardsHeader">Upcoming assignments:</h1>
        { subArr.length != 0 ?
          <div style={{height: "100%"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
              {index != 0 ? 
                <button className="rewardsIndexButton" onClick={() => {setIndex(index - 1)}}>&lt;</button> 
              : <button className="rewardsFakeButton">&lt;</button>}
              <h2>{subArr[index][0]}</h2>
              {index != subArr.length-1 ? 
                <button className="rewardsIndexButton" onClick={() => {setIndex(index + 1)}}>&gt;</button> 
              : <button className="rewardsFakeButton">&gt;</button>}
            </div>
            <div className="rewardsList">
              {subArr[index][1].map((s, i) => {
                return (
                  <div key={i} style={{display:"flex", justifyContent:"center", width: "100%"}}>
                    <div style={{color: 'black', textAlign: "center"}}>{s[1]}</div>
                  </div>
                )
              })}
            </div>
          </div>
          : <h2>No upcoming assignments!</h2>
        }
        <button onClick={() => setOverlay("home")} className="rewardsConfirm">OK</button>
      </div> : <></>}

    </div>
  )
}

Rewards.propTypes = {
  courses: PropTypes.object,
  setOverlay: PropTypes.func,
  skip: PropTypes.bool  
}