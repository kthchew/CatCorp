import { useState } from "react";
import PropTypes from "prop-types";
import "./css/Rewards.css"

export default function Bosses({ courses, setOverlay, bossData }) {
  const [index, setIndex] = useState(0)

  const upcomingAssignments = courses
    .filter((c) => {
      return c[2].length > 0
    })
    .flatMap((c) => {
      return [[c[1], c[2]]]
    })

  return (
    <div className="rewardsBackground">
      <h1 className="rewardsHeader">Class goals:</h1>
      {upcomingAssignments.length != 0 ?
        <div style={{ height: "60%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {index != 0 ?
              <button className="rewardsIndexButton" onClick={() => { setIndex(index - 1) }}>&lt;</button>
              : <button className="rewardsFakeButton">&lt;</button>}
            <h2>{upcomingAssignments[index][0]}</h2>
            {index != upcomingAssignments.length - 1 ?
              <button className="rewardsIndexButton" onClick={() => { setIndex(index + 1) }}>&gt;</button>
              : <button className="rewardsFakeButton">&gt;</button>}
          </div>
          <div className="rewardsList">
            {upcomingAssignments[index][1].map((s, i) => {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <div style={{ color: 'black', textAlign: "center" }}>{s[1]}</div>
                </div>
              )
            })}
          </div>
        </div>
        : <h2>No upcoming assignments!</h2>
      }
      <button onClick={() => setOverlay("home")} className="rewardsConfirm">OK</button>
    </div>
  )
}

Bosses.propTypes = {
  courses: PropTypes.object,
  setOverlay: PropTypes.func,
}