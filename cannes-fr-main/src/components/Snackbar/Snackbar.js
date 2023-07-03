import React from "react";
import "./Snackbar.css";

import { RxCross2 } from "react-icons/rx";

const CustomSnackbar = (props) => {
  return (
    <div className="snackbar">
      <div></div>
      50% off on your first order! Shop Now
      <RxCross2 onClick={props.onClose} className="snackbar-icon" size={25} />
    </div>
  );
};

export default CustomSnackbar;
