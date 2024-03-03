import React, { useState } from "react";
import axios from "axios"
import PropTypes from "prop-types";
import "./css/Store.css"
import loot_box from "./img/lootbox.png"
import store_UI from "./img/store_window.png"
import close_button from "./img/close_button.png"
import adopt_button from "./img/Adopt.png"
import display_frame from "./img/display_frame.png"
import gem_count from "./img/gem_display.png"
const Popup = ({ isOpen, onClose }) => (
  <div>
    {isOpen && (
      <div className="store_container">
        <img src={store_UI}/>
        <button className="close_store" onClick={onClose}>
          <img src={close_button}/>
        </button>
        <button className="adopt">
          <img src={adopt_button}/>
        </button>
        <div className="display_frame"> 
          <img src={display_frame}/>
        </div>
        <div className="lootbox">
          <img src={loot_box}/>
        </div>
        <div className="gem_display">
          <img src={gem_count}/>
        </div> 
      </div>
    )}
  </div>
);

export default Popup;
