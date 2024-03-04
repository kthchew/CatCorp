import { useState } from "react";
import "./css/Store.css";
import store_wid from "./img/UI/store_button.png";
import Store from './Store.jsx'; 

export default function StoreButton() {
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
        <img src={store_wid}/>
      </button>
      <Store isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
}


