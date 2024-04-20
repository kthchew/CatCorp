import PropTypes from "prop-types";
import catTemplate from "./img/CatTemplate.png";
import "./css/CatChangeNotification.css";
import "./css/Cat.css"
import "./css/Store.css"
import close_button from "./img/UI/close_button.png";

export default function CatLoseNotification({cats, closeNotif}) {

    return (
        <div className="store_outer_container" style={{zIndex: 110002}}>
            <div className="store_ears"></div>
            <div className="store_container">
                <div style={{marginBottom: 0}} className="store_header">
                    <button className="close_store" onClick={closeNotif} style={{position: "absolute"}}>
                        <img src={close_button}/>
                    </button>
                    <h1 style={{marginTop: '0', paddingTop: '0', paddingRight: '4.7rem', fontSize: '3rem'}}>You lost cat(s) in your last boss fight.</h1>
                </div>
                <div className="catChangeNotif" style={{height: '70%'}}>
                    <div className="catChangeNotifList" style={{overflowY: "auto", maxHeight: '100%'}}>
                        {
                            cats.map((cat, i) => {
                                const rarityLabel = cat.rarity >= 18 ? "Legendary" :
                                    cat.rarity >= 13 ? "Epic" :
                                    cat.rarity >= 8 ? "Rare" :
                                    "Common";
                                const rarityColor = rarityLabel === "Legendary" ? "gold" :
                                    rarityLabel === "Epic" ? "purple" :
                                    rarityLabel === "Rare" ? "blue" :
                                    "gray";

                            return (
                                <div key={i}>
                                    <div className="catChangeNotifCats" style={{display: "flex", marginBottom: '1rem', paddingTop: '1rem', overflow: "hidden"}}>
                                        <p style={{color: "black", display: "inline"}}>{cat.name} (<span style={{color: rarityColor}}>{rarityLabel}</span>)</p>
                                        <div className='catRelative' style={{margin: '0.5rem 1rem 1rem 1rem', bottom: '1.1rem', zIndex: 100000}}>
                                            <img className='catPeltLarge'
                                                src={`pelts/${cat.pattern}.jpg`}
                                                style={{
                                                    transform: `translate(calc((-100% + 64px) * ${cat.x}), calc((-100% + 64px) * ${cat.y}))`,
                                                    maskPosition: `${cat.x * 100}% ${cat.y * 100}%`
                                                }}
                                            ></img>
                                            <img className='catTemplate' src={catTemplate}></img>
                                            <img className='catTemplate' src={`eyes/${cat.leftEye}.png`}></img>
                                            <img className='catTemplate' src={`eyes/${cat.rightEye}.png`}></img>
                                            <img className='catTemplate' src={`hats/${cat.hat}.png`}></img>
                                        </div>
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

CatLoseNotification.propTypes = {
    cats: PropTypes.array,
    closeNotif: PropTypes.func
}
