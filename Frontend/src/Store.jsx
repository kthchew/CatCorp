import axios from "axios";
import "./css/Store.css"
import PropTypes from "prop-types";
import loot_box from "./img/UI/lootbox.png"
import close_button from "./img/UI/close_button.png"
import adopt_button from "./img/UI/Adopt.png"
import gem_count from "./img/UI/gem_display.png"

export default function Store ({setOverlay, userData, setUserData}) {
  async function buyLootbox(id) {
    try {
      const lootboxResp = await axios.post(`/buyLootbox`, {lootboxID: id});
      setUserData({...userData, gems: userData.gems - lootboxResp.data.spent, cats: [...userData.cats, lootboxResp.data.cat]});
    } catch (e) {
      // TODO: tell user it failed
      console.error("Purchase failed");
    }
  }

  return (
      <div className="store_outer_container">
        <div className="store_ears"></div>
        <div className="store_container">
          <div className="store_header">
            <button className="close_store" onClick={() => setOverlay("home")}>
              <img src={close_button}/>
            </button>
            <div className="gem_display">
              <img src={gem_count}/>
              <p>{userData.gems}</p>
            </div>
          </div>
          <div className="lootbox_collection">
            {
              <div className="lootbox_container">
                <div className="display">
                  <img className="lootbox" src={loot_box}/>
                  {/* TODO: this info should come from the server, not hardcoded here */}
                  <p>Cost: 600</p>
                </div>
                <button className="adopt_button" onClick={() => buyLootbox("1")}>
                  <img src={adopt_button}/>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
  );
}

Store.propTypes = {
  setOverlay: PropTypes.func,
  userData: PropTypes.object,
  setUserData: PropTypes.func
}