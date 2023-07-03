import React from "react";
import { motion } from "framer-motion";
import { CiBoxes, CiDeliveryTruck, CiHotdog, CiMedal } from "react-icons/ci";

import CarouselSlider from "../components/CarouselSlider/CarouselSlider";
import "./HomePage.css";
import Brands from "../components/Brands/Brands";
import FeatureCard from "../components/FeatureCard/FeatureCard";
import ProductCard from "../components/ProductCard/ProductCard";
import { useLoaderData } from "react-router-dom";

const features = [
  {
    id: "1",
    title: "Original Products",
    subtitle: "We provide money back gurantee if the product was not original",
    icon: <CiBoxes size={40} className="feature-icon" />,
  },
  {
    id: "2",
    title: "Satisfaction Gurantee",
    subtitle: "Exchange the product you 've purchased if it doesn't fit on you",
    icon: <CiHotdog size={40} className="feature-icon" />,
  },
  {
    id: "3",
    title: "New Arrival Everyday",
    subtitle: "We updates our collections almost everyday",
    icon: <CiMedal size={40} className="feature-icon" />,
  },
  {
    id: "4",
    title: "Fast & Free Shipping",
    subtitle: "We offer fast and free shipping for our loyal customers",
    icon: <CiDeliveryTruck size={40} className="feature-icon" />,
  },
];

const HomePage = () => {
  const data = useLoaderData();

  return (
    <div className="HomePage">
      <CarouselSlider imagesArray={data.carouselElements} />
      <Brands />

      {/* Static Content Starts */}
      <div className="HomePage-content">
        <div className="HomePage-content-h1">
          We provide best
          <br /> customer experiences
        </div>
        <div className="HomePage-content-h2">
          We ensure our customers have the best shopping experience
        </div>
      </div>
      {/* Static Content Ends */}
      {/* Features Section Start */}
      <div className="HomePage-features">
        <ul>
          {features.map((e) => (
            <li key={e.id}>
              {e.icon}
              <FeatureCard key={e.id} title={e.title} subtitle={e.subtitle} />
            </li>
          ))}
        </ul>
      </div>
      {/* Features Section Ends */}

      {/* Featured Products Starts */}

      <div className="featured__products">
        <div className="featured__products-heading">Featured Products</div>
        <ul>
          {data.products.map((item) => (
            <li key={item._id}>
              <ProductCard
                id={item._id}
                url={item.imageUrls[0].secure_url}
                key={item.id}
                title={item.name}
                price={item.price}
                isOnSale={item.isOnSale}
                discountedPrice={item.salePrice}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Products End */}

      {/* Discount Offer Section */}

      <motion.div
        whileInView={{ opacity: [0, 1], y: [50, 0] }}
        transition={{ duration: 2 }}
        className="Discount__Offer"
      >
        <div className="Discount__Offer-image">
          <img
            alt="Dis"
            src="https://images.pexels.com/photos/4042029/pexels-photo-4042029.jpeg?auto=compress&cs=tinysrgb&w=600"
          />
        </div>
        <div className="Discount__Offer-content">
          <div className="Discount__Offer-content__heading">Limited Offer</div>
          <div className="Discount__Offer-content__description">
            35% off only this friday and get special gift
          </div>
          <div className="Discount__Offer-content__cta">
            <button>Grab it</button>
          </div>
        </div>
      </motion.div>

      {/* Discount Offer Section Ends */}

      {/* Newsletter Subscription Starts */}
      <motion.div className="nwsltrSubscription">
        <div className="nwsltrSubscription__heading">
          Subscribe to our newsletter to get updates
          <br /> to our latest collections
        </div>
        <div className="nwsltrSubscription__subheading">
          Get 20% off on your first order just by subscribing to our newsletter
        </div>
        <div className="nwsltrSubscription__actions">
          <div className="nwsltrSubscription__actions-input">
            <input placeholder="Enter your Email" />
            <button>Subscribe</button>
          </div>
        </div>
      </motion.div>
      {/* Newsletter Subscription Ends */}
    </div>
  );
};

export async function loader() {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}/ui/trending`
  );

  if (!response.ok) {
    const data = { message: "Could not connect." };
    throw { isError: true, message: data.message, status: response.status };
  }

  return response;
}

export default HomePage;
