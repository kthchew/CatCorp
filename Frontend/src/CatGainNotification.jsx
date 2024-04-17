import PropTypes from "prop-types";
import catTemplate from "./img/CatTemplate.png";
import "./css/CatGainNotification.css";
import "./css/Cat.css"
import "./css/Store.css"
import close_button from "./img/UI/close_button.png";

export default function CatGainNotification({cat, closeNotif}) {
    const rarityLabel = cat.rarity >= 18 ? "Legendary" :
        cat.rarity >= 13 ? "Epic" :
        cat.rarity >= 8 ? "Rare" :
        "Common";
    const rarityColor = rarityLabel === "Legendary" ? "gold" :
        rarityLabel === "Epic" ? "purple" :
        rarityLabel === "Rare" ? "blue" :
        "gray";

    return (
        <div className="store_outer_container" style={{zIndex: 110002}}>
            <div className="store_ears"></div>
            <div className="store_container">
                <div style={{marginBottom: 0}} className="store_header">
                    <button className="close_store" onClick={closeNotif}>
                        <img src={close_button}/>
                    </button>
                </div>
                <div className="catChangeNotif">
                    <h1>You gained a new cat!</h1>
                    <div className="catChangeNotifCats">
                        <p style={{color: "black"}}>Name: {cat.name}</p>
                        <p style={{color: "black"}}>Rarity: <span style={{color: rarityColor}}>{rarityLabel}</span></p>
                        <div className='catLarge' style={{bottom: "50%", left: "70%", zIndex: 100000}}>
                            <img className='catPeltLarge'
                                 src={`pelts/${cat.pattern}.jpg`}
                                 style={{
                                     transform: `translate(calc((-100% + 64px) * ${cat.x}), calc((-100% + 64px) * ${cat.y}))`,
                                     maskPosition: `${cat.x * 100}% ${cat.y * 100}%`
                                 }}
                            ></img>
                            <img className='catTemplateLarge' src={catTemplate}></img>
                            <img className='catTemplate' src={`eyes/${cat.leftEye}.png`}></img>
                            <img className='catTemplate' src={`eyes/${cat.rightEye}.png`}></img>
                            <img className='catTemplateLarge' src={`hats/${cat.hat}.png`}></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

CatGainNotification.propTypes = {
    cat: PropTypes.object,
    closeNotif: PropTypes.func
}
