import { useState } from "react";
import PropTypes from "prop-types";
import background from "../src/img/UI/boss_fight.png"
// import Cat from "./Cat"
import boss from "../src/img/bossTemp.png"

export default function Bosses({ setOverlay, bossData }) {
  const [index, setIndex] = useState(0)
  const averages = bossData.map((course) => {
    return Math.round(Object.values(course[2]).reduce((x, y) => x + y, 0) / Object.values(course[2]).length * 100)
  })

  return (
    <div className="rewardsBackground">
      <h1 className="rewardsHeader">Class goals:</h1>
      {bossData && bossData.length != 0 ?
        <div style={{display: "flex", height:"60%"}}>
          <div style={{ height: "60%", width: "40%" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {index != 0 ?
                <button className="rewardsIndexButton" onClick={() => { setIndex(index - 1) }}>&lt;</button>
                : <button className="rewardsFakeButton">&lt;</button>}
              <h2>{bossData[index][0]}</h2>
              {index != bossData.length - 1 ?
                <button className="rewardsIndexButton" onClick={() => { setIndex(index + 1) }}>&gt;</button>
                : <button className="rewardsFakeButton">&gt;</button>}
            </div>
            <div className="rewardsList">
              {Object.keys(bossData[index][2]).map((s, i) => {
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div style={{ color: 'black', textAlign: "center" }}>{s} - {Math.round(Object.values(bossData[index][2])[i] * 100)}% complete</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{position: "relative"}}>
            {/* <Cat/> */}
            {averages[index] < 80 ? 
            <div>
              <div className="bossHealthbar" style={{background: `linear-gradient(90deg, limegreen ${averages[index]}%, red ${averages[index]}%, red 79%, black 79%, black 80%, red 80%)`}}></div>
              <div className="bossStatus" style={{color: "red"}}>{averages[index]}% total completion</div>
            </div>
            : 
            <div>
              <div className="bossHealthbar" style={{background: `linear-gradient(90deg, limegreen 79%, black 79%, black 80%, limegreen 80%, limegreen ${averages[index]}%, red ${averages[index]}%)`}}></div>
              <div className="bossStatus" style={{color: "lightgreen"}}>{averages[index]}% total completion</div>
            </div>
            }
            <img src={boss} className="bossCat"></img>
            <img src={background} className="bossBackground"></img>
          </div>
        </div>
        : <h2>No ongoing bossfights!</h2>
      }
      <button onClick={() => setOverlay("home")} className="rewardsConfirm">OK</button>
    </div>
  )
}

Bosses.propTypes = {
  bossData: PropTypes.array,
  setOverlay: PropTypes.func,
}