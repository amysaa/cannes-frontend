import Lottie from "lottie-react";
import LoadingCart from "../Assets/loading-cart.json";

import "./SplashScreen.css";

import React from "react";

const SplashScreen = () => {
  return (
    <div className="SplashScreen">
      <p>Cannes</p>
      <Lottie className="SplashScreen-animation" animationData={LoadingCart} />
    </div>
  );
};

export default SplashScreen;
