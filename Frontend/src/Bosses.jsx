import { useState } from "react";
import PropTypes from "prop-types";
import "./css/Rewards.css"

export default function Bosses({ setOverlay, bossData }) {
  const [index, setIndex] = useState(0)

  return (
    <div className="rewardsBackground">
      <h1 className="rewardsHeader">Class goals:</h1>
      {bossData.length != 0 ?
        <div style={{ height: "60%" }}>
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
                  <div style={{ color: 'black', textAlign: "center" }}>{s}</div>
                </div>
              )
            })}
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