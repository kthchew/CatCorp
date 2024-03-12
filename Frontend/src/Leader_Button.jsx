import { useState } from "react";
import leader_wid from "./img/UI/Leader.png";
import Leader from './Leader.jsx'; 

export default function LeaderButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <button onClick={openPopup} disabled={isPopupOpen}>
        <img src={leader_wid}/>
      </button>
      <Leader isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
}