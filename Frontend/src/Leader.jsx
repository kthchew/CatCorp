import "./css/Leader.css"
import PropTypes from "prop-types"
import leader_UI from "./img/UI/store_window.png"
import close_button from "./img/UI/close_button.png"

export default function Leader ({isOpen, onClose}) {
  return(
  <div>
    {isOpen && (
      <div className="leader_container">
        <button className="close_leader" onClick={onClose}>
          <img src={close_button}/>
        </button>
        <img src={leader_UI}/>
      </div>
    )}
  </div>
  );
}

Leader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired
}