import "./css/Store.css"
import PropTypes from "prop-types";
import loot_box from "./img/UI/lootbox.png"
import store_UI from "./img/UI/store_window.png"
import close_button from "./img/UI/close_button.png"
import adopt_button from "./img/UI/Adopt.png"
import display_frame from "./img/UI/display_frame.png"
import gem_count from "./img/UI/gem_display.png"

export default function Store ({isOpen, onClose}) {
  return(
  <div>
    {isOpen && (
      <div className="store_container">
        <button className="close_store" onClick={onClose}>
          <img src={close_button}/>
        </button>
        <img src={store_UI}/>
        <img src={display_frame} id="display_frame"/>
          <div className="lootbox">
            <img src={loot_box}/>
          </div>
        <button className="adopt">
          <img src={adopt_button}/>
        </button>
        <img src={gem_count} className="gem_display"/>
      </div>
    )}
  </div>
  );
}

Store.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired
}