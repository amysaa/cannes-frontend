import React, { useEffect, useContext, useState } from "react";

import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Navbar from "../components/NavBar/Navbar";
import CustomSnackbar from "../components/Snackbar/Snackbar";

import { getTokenDuration } from "../utils/isAuth";
import AuthContext from "../store/auth-context";
import CartContext from "../store/cart-context";

const RootLayout = () => {
  const token = useLoaderData();
  const submit = useSubmit();
  const [hide, setHide] = useState(true);

  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  useEffect(() => {
    if (!token) {
      return;
    }
    if (token === "EXPIRED") {
      submit(null, { action: "/auth/logout", method: "POST" });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: "/auth/logout", method: "POST" });
    }, tokenDuration);
  }, [submit, token]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}/auth/user`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.ok) {
          const userProfileData = await response.json();
          authCtx.setUserProfile(userProfileData.user);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error, "This is the error from catch block");
      }
    };
  }, [token]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}/cart`,
          {
            method: "GET",
            credentials: "include",
            headers: token
              ? {
                  Authorization: "Bearer " + token,
                }
              : {},
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.cart, "THis is the data from cartCtx set Cart");
          cartCtx.setcart(data.cart);
          cartCtx.setTotalItems(data.cart.items.length);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error, "This is the error from catch block");
      }
    };

    fetchCart();
  }, [token]);

  return (
    <div>
      <Navbar />
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
};

export default RootLayout;
