import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./css/Store.css";
import store_wid from "./img/store_button.png";
import Store from './Store.jsx'; 

const storeButton = () => {
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
};

export default storeButton;

