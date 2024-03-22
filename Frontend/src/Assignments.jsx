import PropTypes from "prop-types";

import Rewards from "./Rewards"

export default function Assignments({userData, courses, setOverlay}) {
    return <>
    <h3>Your cash: {userData.gems}</h3>
    <Rewards courses={courses} userData={userData}/>
    <h1>Your course info</h1>
    {
        courses && courses.message != "No courses available" ? 
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
    }
    <button onClick={() => setOverlay("home")}>Back to Home</button>
    </>
}

Assignments.propTypes = {
    userData: PropTypes.object,
    courses: PropTypes.array,
    userId: PropTypes.string,
    setOverlay: PropTypes.func
}
