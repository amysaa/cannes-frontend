import React, { useState } from "react";
import Rating from "@mui/material/Rating";

const RatingInput = (props) => {
  console.log(props);
  const [value, setValue] = useState(0);
  if (props.value) {
    setValue(props.value);
  }

  return (
    <div>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          props.submitRating(newValue);
        }}
      />
    </div>
  );
};

export default RatingInput;
