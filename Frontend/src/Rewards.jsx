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
      if (c[3].length > 0) {
        subs.push([c[1], c[3]]);
      }
    })

    console.log("subs", subs)

    if (subs.length == 0) {
      setOverlay("home")
    } else {
      setSubArr(subs)
    }
  }, [courses])

  return (
    <div>
      {subArr.length > 0 ? <div className="rewardsBackground">
        <h1 className="rewardsHeader">Gems earned:</h1>
        <div style={{display: "flex"}}>
          {index != 0 ? 
            <button className="rewardsIndexButton" onClick={() => {setIndex(index - 1)}}>&lt;</button> 
          : <button>&lt;</button>}
          <h2>{subArr[index][0]}</h2>
          {index != subArr.length-1 ? 
            <button className="rewardsIndexButton" onClick={() => {setIndex(index + 1)}}>&gt;</button> 
          : <button>&gt;</button>}
        </div>
        <div className="rewardsList">
          {subArr[index][1].map((s, i) => {
            return (
              <div key={i} style={{display:"flex", justifyContent:"center", width: "100%"}}>

                <div style={{color: 'black', textAlign: "center"}}>{s[1]} -&nbsp;</div>
    
                <div  style={{color: 'blue', fontWeight: 'bold'}}>{s[8]}
                  <img src={gem} className="rewardsGem"></img>
                </div>
                
              </div>
            )
          })}
        </div>
        <button onClick={() => setOverlay("home")} className="rewardsConfirm">OK</button>
      </div> : <></>}

    </div>
  )
}

Rewards.propTypes = {
  courses: PropTypes.object,
  setOverlay: PropTypes.func
}