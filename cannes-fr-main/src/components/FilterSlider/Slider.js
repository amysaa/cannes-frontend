import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const MySlider = (props) => {
  const [sliderValue, setSliderValue] = useState(2000);

  const handleSliderChange = (value) => {
    setSliderValue(value);
    props.onSliderFilterChange(value);
  };

  return (
    <div>
      <Slider max={10000} value={sliderValue} onChange={handleSliderChange} />
      <div>Rs: {sliderValue}</div>
    </div>
  );
};

export default MySlider;
