import "./css/Store.css"
import PropTypes from "prop-types";
import loot_box from "./img/UI/lootbox.png"
import store_UI from "./img/UI/store_window.png"
import close_button from "./img/UI/close_button.png"
import adopt_button from "./img/UI/Adopt.png"
import display_frame from "./img/UI/display_frame.png"
import gem_count from "./img/UI/gem_display.png"
import axios from "axios"



export default function Store ({setOverlay, userData, setUserData}) {

  async function buyLootboxTest() {
    try {
      const lootboxResp = await axios.post(`/buyLootbox`, {lootboxID: "1"});
      setUserData({...userData, gems: userData.gems - lootboxResp.data.spent, cats: [...userData.cats, lootboxResp.data.cat]});
    } catch (e) {
      console.error("Purchase failed");
    }
  }

  return (
      <div className="store_container">
        <button className="close_store" onClick={() => setOverlay("home")}>
          <img src={close_button}/>
        </button>
        <div className="gem_display" >
          <img src={gem_count} style={{marginRight: "-55px"}}/>

          <div style={{zIndex: 10, width:"55px", fontWeight:"bold"}}>{userData.gems}</div>
        </div>
        <img src={store_UI}/>
        <div className="display">
          <img src={display_frame} id="display_frame"/>
          <div className="lootbox">
            <img src={loot_box}/>
          </div>
        </div>  
        <div className="adopt" onClick={() => buyLootboxTest()}>
          <button className="adopt_button" >
            <img src={adopt_button}/>
          </button>
        </div>
      </div>
  );
}

Store.propTypes = {
  setOverlay: PropTypes.func,
  userData: PropTypes.object,
  setUserData: PropTypes.func
}