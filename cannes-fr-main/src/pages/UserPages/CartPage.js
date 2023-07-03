import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import "./CartPage.css";

import { GrFormAdd } from "react-icons/gr";
import { BiMinus } from "react-icons/bi";

import EmptyBagImage from "../../Assets/empty-bag.png";
import Loader from "../../components/Loader/Loader";

import AuthContext from "../../store/auth-context";
import CartContext from "../../store/cart-context";
import { Form } from "react-router-dom";

const CartPage = () => {
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [couponCode, setCouponCode] = useState(cartCtx.couponCode);

  if (!cartCtx.items || cartCtx.items.length === 0)
    return (
      <div className="CartPage-Empty">
        <img src={EmptyBagImage} alt="Empty Bag" />
        <p>Your Cart is Empty</p>
      </div>
    );

  let totalPrice = 0;
  cartCtx.items.forEach(({ product, quantity }) => {
    totalPrice = totalPrice + product.price * quantity;
  });

  const couponChangeHandler = (event) => {
    setCouponCode(event.target.value);
  };

  const onApplyDiscountHandler = (e) => {
    console.log(couponCode);
    cartCtx.applyDiscountHandler(couponCode);
  };

  const checkoutHandler = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const response = await cartCtx.checkoutHandler();
    console.log(response);
    if (response && response.status && response.status === "ERROR") {
      setError(response.message);
      setIsSubmitting(false);
    }

    if (response && response.status && response.status === "REDIRECT") {
      window.location.replace(response.url);
    }

    console.log("response", response);
    setIsSubmitting(false);
  };

  return (
    <div className="Cartpage-wrapper">
      <div className="Cartpage-heading__title">
        {authCtx.name}'s <span>Cart</span>
        <div className="Cartpage-heading__title-timeline">
          Cart · Checkout · Payment
        </div>
      </div>
      <div className="Cartpage">
        <div className="Cartpage-items">
          <ul>
            {cartCtx.items &&
              cartCtx.items.map(
                ({ product, quantity, _id }) =>
                  product && (
                    <li key={_id}>
                      <CartProductCard
                        id={product._id}
                        price={product.price}
                        name={product.name}
                        image={product.imageUrls[0].secure_url}
                        quantity={quantity}
                        onAddClick={() => {
                          cartCtx.qtyChangeHandler(product._id, true);
                        }}
                        onRemoveClick={() => {
                          cartCtx.qtyChangeHandler(product._id, false);
                        }}
                      />
                    </li>
                  )
              )}
          </ul>
        </div>
      </div>
      <motion.div
        whileInView={{ opacity: [0, 1], x: [50, 0] }}
        transition={{ duration: 1 }}
        className="checkout-container"
      >
        <form className="discount-form">
          <p style={{ fontWeight: "bold" }}>All prices includes GST</p>
          {error && <div className="error-msg">{error}</div>}
          <br />
          <div className="input-box">
            <div>Total</div>
            <p>Rs. {totalPrice}</p>
          </div>
          <br />
          <div className="input-box">
            <div>Delivery Charge</div>
            <p>Rs. 150</p>
          </div>
          <br />
          <div className="input-box">
            <input
              defaultValue={cartCtx.couponCode}
              onChange={couponChangeHandler}
              type="text"
              placeholder="Apply your coupons here"
              name="couponCode"
            />
            <button type="button" onClick={onApplyDiscountHandler}>
              {cartCtx.couponCode ? "Applied" : "Apply"}
            </button>
          </div>
          {cartCtx.couponCode &&
            cartCtx.couponCode === "FLAT50" &&
            "Discount Applied"}
        </form>
        <Form onSubmit={checkoutHandler}>
          <button
            disabled={isSubmitting}
            type="submit"
            className="checkout-btn"
          >
            {isSubmitting ? <Loader /> : <>Rs. {cartCtx.totalPrice} Checkout</>}
          </button>
        </Form>
      </motion.div>
    </div>
  );
};

const CartProductCard = ({
  name,
  image,
  quantity,
  onAddClick,
  onRemoveClick,
  price,
}) => {
  if (name.length > 15) {
    name = name.slice(0, 15);
  }

  return (
    <motion.div
      whileInView={{ opacity: [0, 1], y: [-50, 0] }}
      transition={{ duration: 0.5 }}
      className="CartProductCard"
    >
      <div className="CartProductCard-image">
        <img src={image} alt={name}></img>
        <div className="CartProductCard-content">
          <p>{name}</p>
        </div>
      </div>

      <div className="CartProductCard-qty">
        Rs. {price}
        <GrFormAdd className="icon" size={20} onClick={onAddClick} />
        <p>{quantity}</p>
        <BiMinus className="icon" size={20} onClick={onRemoveClick} />
      </div>
    </motion.div>
  );
};

export default CartPage;
