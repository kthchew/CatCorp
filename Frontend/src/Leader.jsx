import "./css/Leader.css"
import PropTypes from "prop-types"
import leader_UI from "./img/UI/leady.png"
import close_button from "./img/UI/close_button.png"

export default function Leader ({isOpen, onClose}) {
  return(
  <div>
    {isOpen && (
      <div className="leader_container">
        <button className="close_leader" onClick={onClose}>
          <img src={close_button}/>
        </button>
        <div className="display">
          <img src={leader_UI}/>
          <h1 className="leaderboard">Leaderboard</h1>
          <div className="category">
            <h2 className="cate1">Username   </h2>
            <h2 className="cate2">Number of Cats</h2>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}

Leader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired
}