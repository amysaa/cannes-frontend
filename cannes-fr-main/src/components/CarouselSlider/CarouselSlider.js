import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./CarouselSlider.css";
import { useNavigate } from "react-router-dom";

const CarouselSlider = ({ imagesArray }) => {
  const settings = {
    // dots: true,
    swipe: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    // accessibility: false,
    arrows: false,
  };

  return (
    <Slider className="c_slider" {...settings}>
      {imagesArray.map((e) => (
        <CarouselCard key={e.id} title={e.title} image={e.image} />
      ))}
    </Slider>
  );
};

const CarouselCard = (props) => {
  const style = {
    backgroundImage: `url(${props.image})`,
    backdropFilter: ` brightness(50%) saturate(0%) opacity(70%)`,
  };

  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="carousel__card"
        style={style}
      >
        <p>{props.title}</p>
        <button
          onClick={() => {
            navigate("products");
          }}
          className="carousel__card-btn"
        >
          Shop Now
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CarouselSlider;
