import { useState } from "react";
import store_wid from "./img/UI/store_button.png";
import Store from './Store.jsx'; 
import leader_wid from "./img/UI/Leader.png";
import Leader from './Leader.jsx';

export default function StoreButton() {
  const [isStorePopupOpen, setIsStorePopupOpen] = useState(false);
  const [isLeaderPopupOpen, setIsLeaderPopupOpen] = useState(false);

  const openStorePopup = () => {
    setIsStorePopupOpen(true);
  };

  const closeStorePopup = () => {
    setIsStorePopupOpen(false);
  };

  const openLeaderPopup = () => {
    setIsLeaderPopupOpen(true);
  };

  const closeLeaderPopup = () => {
    setIsLeaderPopupOpen(false);
  };

  const isAnyPopupOpen = isStorePopupOpen || isLeaderPopupOpen;

  return (
    <div>
      <button onClick={openStorePopup} disabled={isAnyPopupOpen}>
        <img src={store_wid}/>
      </button>
      <Store isOpen={isStorePopupOpen} onClose={closeStorePopup} />
      <button onClick={openLeaderPopup} disabled={isAnyPopupOpen }>
        <img src={leader_wid}/>
      </button>
      <Leader isOpen={isLeaderPopupOpen} onClose={closeLeaderPopup} />
    </div>
  );
}
