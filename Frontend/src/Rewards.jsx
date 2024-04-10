import { useState } from "react";
import PropTypes from "prop-types";
import "./css/Rewards.css"
import gem from "../src/img/gem.png"

export default function Rewards({ courses, setOverlay }) {
  const [index, setIndex] = useState(0)

  const newSubmissions = courses
    .filter((c) => {
      return c[3].length > 0
    })
    .flatMap((c) => {
      return [[c[1], c[3]]]
    })

  return (
    <div className="rewardsBackground">
      <h1 className="rewardsHeader">Gems earned:</h1>
      {newSubmissions.length != 0 ?
        <div style={{ height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {index != 0 ?
              <button className="rewardsIndexButton" onClick={() => { setIndex(index - 1) }}>&lt;</button>
              : <button className="rewardsFakeButton">&lt;</button>}
            <h2>{newSubmissions[index][0]}</h2>
            {index != newSubmissions.length - 1 ?
              <button className="rewardsIndexButton" onClick={() => { setIndex(index + 1) }}>&gt;</button>
              : <button className="rewardsFakeButton">&gt;</button>}
          </div>
          <div className="rewardsList">
            {newSubmissions[index][1].map((s, i) => {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "center", width: "100%" }}>

                  <div style={{ color: 'black', textAlign: "center" }}>{s[1]} -&nbsp;</div>

                  <div style={{ color: 'blue', fontWeight: 'bold' }}>{s[8]}
                    <img src={gem} className="rewardsGem"></img>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
        : <h2>No assignments submitted since last login!</h2>
      }
      <button onClick={() => setOverlay("home")} className="rewardsConfirm">OK</button>
    </div>
  )
}

Rewards.propTypes = {
  courses: PropTypes.object,
  setOverlay: PropTypes.func,
}