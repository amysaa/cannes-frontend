import React, { useState } from "react";
import "./SelectCategoryCard.css";

const SelectCategoryCard = (props) => {
  const [checked, setChecked] = useState(false);

  const onSelectHandler = (event) => {
    if (!checked) {
      setChecked(true);
      onChecked(props.name);
    } else {
      setChecked(false);
      onUnchecked(props.name);
    }
  };

  const onChecked = () => {
    props.onChecked(props.name);
  };

  const onUnchecked = () => {
    props.onUnchecked(props.name);
  };

  return (
    <div key={props.id} className="category-card">
      <input type="checkbox" checked={checked} onChange={onSelectHandler} />
      <li>{props.name}</li>
      <br />
    </div>
  );
};

export default SelectCategoryCard;
