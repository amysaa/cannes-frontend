import React, { useContext, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLoaderData, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { AiFillStar } from "react-icons/ai";

import Modal from "../components/Modals/Modal";
import RatingInput from "../components/Ratings/Rating";

import "./ProductDescriptionPage.css";
import CartContext from "../store/cart-context";
import AuthContext from "../store/auth-context";

import { getAuthToken } from "../utils/isAuth";

const ProductDescriptionPage = () => {
  const data = useLoaderData();
  const reviewtextRef = useRef();
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showModal, setshowModal] = useState(false);
  const [rating, setRating] = useState();
  const [isReviewErrorText, setIsReviewErrorText] = useState(false);

  const [review, setReview] = useState();

  console.log(data.product);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const reviewFormHandler = async (e) => {
    e.preventDefault();

    console.log(reviewtextRef.current.value);

    if (!reviewtextRef.current.value) return;

    const response = await fetch(
      process.env.REACT_APP_BACKEND_HOST +
        "/product/" +
        data.product._id +
        "/review",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAuthToken(),
        },
        body: JSON.stringify({ text: reviewtextRef.current.value, rating }),
      }
    );

    const jObj = await response.json();

    if (response.ok) {
      setshowModal(false);
    } else {
      setIsReviewErrorText(true);
      setReview(jObj.message);
    }
  };

  const ratingHandler = (rating) => {
    setRating(rating);
  };

  return (
    <>
      <div className="ProductDescriptionPage">
        <div className="ProductDescriptionPage-images">
          <p>Images</p>
          <ul>
            {data.product.imageUrls.map((item) => (
              <div className="item-image" key={item.id}>
                <motion.img
                  whileInView={{ opacity: [0, 1], x: [0, 1] }}
                  transition={{ duration: 0.5 }}
                  src={item.secure_url}
                  alt="im"
                ></motion.img>
              </div>
            ))}
          </ul>
        </div>
        <motion.div
          whileInView={{ opacity: [0, 1], y: [50, 0] }}
          transition={{ duration: 0.5 }}
          className="ProductDescriptionPage-content"
        >
          <h2 className="ProductDescriptionPage-content__title">
            {data && data.product && data.product.name}
          </h2>
          <h4 style={{ display: "flex", alignItems: "center" }}>
            <p>
              {data.product.ratings && (
                <>{calculateRatings(data.product.ratings)}</>
              )}
            </p>
            <AiFillStar color="yellow" />
          </h4>
          <h3>Rs. {data.product.price}</h3>
          <h4>Brand: {data && data.product && data.product.brand}</h4>
          <h5>{data && data.product && data.product.description}</h5>
          <p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                if (authCtx.email) {
                  cartCtx.qtyChangeHandler(data.product._id, true);
                  setOpen(true);
                  return;
                }
                navigate("/auth/login");
              }}
              className="add-to-cart-cta"
              type="button"
            >
              Add to Cart
            </motion.button>
            {authCtx.email && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="add-to-cart-cta"
                onClick={() => {
                  setshowModal(true);
                }}
              >
                Write a review
              </motion.button>
            )}
          </p>
        </motion.div>
      </div>
      <br />
      <br />
      <div className="ProductPageReviews">
        <h2>Product Reviews</h2>
        {showModal && (
          <Modal
            onClose={() => {
              setshowModal(false);
            }}
          >
            <h2>Add a Review</h2>
            <form className="review-form" onSubmit={reviewFormHandler}>
              {isReviewErrorText && <p>{review}</p>}
              <label htmlFor="reviewText" id="reviewLabel">
                Please enter your review
              </label>
              <textarea
                ref={reviewtextRef}
                placeholder="Write review in 150 words"
              />
              <br />
              <RatingInput submitRating={ratingHandler} />
              <button type="submit">Publish</button>
            </form>
          </Modal>
        )}
        <ul>
          {data.product.reviews &&
            data.product.reviews.map((item) => {

              console.log(data.product.reviews);

              return (
                <motion.li
                  whileInView={{ opacity: [0, 1], x: [-50, 0] }}
                  transition={{ duration: 0.5 }}
                  className="ProductReview-card"
                >
                  <p className="ProductReview-card__username">
                    {item.userId.name}
                  </p>
                  <p className="ProductReview-card__text">{item.text}</p>
                </motion.li>
              );
            })}
        </ul>
        <ul>
          {!data.product.reviews ||
            (data.product.reviews.length === 0 && <p>No Reviews Added</p>)}
        </ul>
      </div>

      <Snackbar
        style={{ color: "var(--primary-text-color)" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          style={{
            backgroundColor: "transparent",
            color: "var(--primary-text-color)",
          }}
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Added to Cart!
        </Alert>
      </Snackbar>
    </>
  );
};

const calculateRatings = (ratings) => {
  console.log(ratings);
  let totalRatings = 0;
  ratings.forEach((item) => {
    totalRatings = totalRatings + item.rating;
  });
  console.log("RATING IS CALCULATED", totalRatings / ratings.length);
  return (totalRatings / ratings.length).toString() === "NaN"
    ? 0
    : totalRatings / ratings.length;
};

export async function loader({ request, params }) {
  const p = params;
  const response = await fetch(
    process.env.REACT_APP_BACKEND_HOST + "/product/" + p.productId
  );

  if (!response.ok) {
    const data = { message: "Coult not fetch Products" };
    throw { isError: true, message: data.message, status: response.status };
  }

  return response;
}

export default ProductDescriptionPage;
