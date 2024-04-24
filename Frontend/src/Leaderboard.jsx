import PropTypes from "prop-types";
import axios from "axios";
import catTemplate from "./img/CatTemplate.png";
import "./css/CatChangeNotification.css";
import "./css/Cat.css"
import "./css/Store.css"
import close_button from "./img/UI/close_button.png";
import { useEffect, useState } from "react";

export default function Leaderboard({closeNotif}) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    async function getUsers() {
        try {
            const res = await axios.get('/getLeaderboard')
            setUsers(res.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="store_outer_container" style={{zIndex: 110002}}>
            <div className="store_ears"></div>
            <div className="store_container">
                <div style={{marginBottom: 0}} className="store_header">
                    <button className="close_store" onClick={closeNotif} style={{position: "absolute"}}>
                        <img src={close_button}/>
                    </button>
                    <h1 style={{marginTop: '0', paddingTop: '0', paddingRight: '27rem', fontSize: '3rem'}}>Leaderboard</h1>
                </div>
                <div className="catChangeNotif" style={{height: '70%'}}>
                    <div className="catChangeNotifList" style={{overflowY: "auto", maxHeight: '100%'}}>
                        {
                            loading ? <></> : users.map((user, i) => {

                                return (
                                    <div key={user.username} style={{color: "black"}}>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div className="catChangeNotifCats" style={{display: "flex"}}>
                                                <p>{i + 1}. {user.username}</p>
                                                <div className='catRelative' style={{zIndex: 100000, position: "relative", bottom: "0.25rem", left: "1rem"}}>
                                                    <img className='catPeltLarge'
                                                        src={`pelts/${user.catRepresentation.pattern}.jpg`}
                                                        style={{
                                                            transform: `translate(calc((-100% + 64px) * ${user.catRepresentation.x}), calc((-100% + 64px) * ${user.catRepresentation.y}))`,
                                                            maskPosition: `${user.catRepresentation.x * 100}% ${user.catRepresentation.y * 100}%`
                                                        }}
                                                    ></img>
                                                    <img className='catTemplate' src={catTemplate}></img>
                                                    {user.catRepresentation.eyes ? <img className='catTemplate' src={`eyes/${user.catRepresentation.eyes}.png`}></img> :
                                                        <>
                                                            <img className='catTemplate' src={`eyes/${user.catRepresentation.leftEye}.png`}></img>
                                                            <img className='catTemplate' src={`eyes/${user.catRepresentation.rightEye}.png`}></img>
                                                        </>
                                                    }
                                                    <img className='catTemplate' src={`hats/${user.catRepresentation.hat}.png`}></img>
                                                </div>
                                            </div>
                                            <p>{user.cats} cats</p>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

Leaderboard.propTypes = {
    users: PropTypes.array,
    closeNotif: PropTypes.func
}
