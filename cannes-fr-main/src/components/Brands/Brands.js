import React from "react";
import "./Brands.css";

const brands = [
  {
    id: 1,
    name: "Gucci",
    url: `${process.env.REACT_APP_BACKEND_HOST}/images/gucci.png`,
  },
  {
    id: 2,
    name: "Levis",
    url: `${process.env.REACT_APP_BACKEND_HOST}/images/levis.jpg`,
  },
  {
    id: 3,
    name: "Louis Vitton",
    url: `${process.env.REACT_APP_BACKEND_HOST}/images/lv.png`,
  },
  {
    id: 4,
    name: "Louis Phillipe",
    url: `${process.env.REACT_APP_BACKEND_HOST}/images/lp.png`,
  },
  {
    id: 5,
    name: "Zara",
    url: `${process.env.REACT_APP_BACKEND_HOST}/images/zara.png`,
  },
];

const Brands = () => {
  return (
    <div className="brands">
      <h4 className="brand__heading">Brands</h4>
      <br />
      <ul className="brands__list">
        {brands.map((e) => (
          <li key={e.id}>
            <BrandImage key={e.id} url={e.url} name={e.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const BrandImage = (props) => {
  return (
    <div className="Brand__ImageCard">
      <img src={props.url} alt={props.name} />
    </div>
  );
};

export default Brands;
