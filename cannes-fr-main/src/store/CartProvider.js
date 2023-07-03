import { useEffect, useState } from "react";

import CartContext from "./cart-context";
import { getAuthToken } from "../utils/isAuth";
import { redirect } from "react-router-dom";

const CartProvider = (props) => {
  const [cart, setcart] = useState({});

  const [totalItems, setTotalItems] = useState(0);

  const [refreshCart, setrefreshCart] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}/cart`,
          {
            method: "GET",
            credentials: "include",
            headers: getAuthToken()
              ? {
                  Authorization: "Bearer " + getAuthToken(),
                }
              : {},
          }
        );

        if (response.ok) {
          const data = await response.json();
          setcart({});
          setcart(data.cart);
          setTotalItems(data.cart.items.length);
          setrefreshCart(false);
        } else {
          console.log(response);
          setrefreshCart(false);
        }
      } catch (error) {
        console.log(error, "This is the error from catch block");
        setrefreshCart(false);
      }
    };

    fetchCart();
  }, [refreshCart]);

  const qtyChangeHandler = async (productId, addorRemove) => {
    let url = `${process.env.REACT_APP_BACKEND_HOST}/cart`;

    if (addorRemove) {
      url = url + "/add";
    } else {
      url = url + "/remove";
    }

    console.log(url);
    try {
      const response = await fetch(url, {
        method: addorRemove ? "POST" : "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAuthToken(),
        },
        body: JSON.stringify({ productId }),
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log(data, "This is the data after adding a product");
        setrefreshCart(true);
      } else {
      }
    } catch (error) {
      console.log(error, "This is the error from catch block");
    }
  };

  const applyDiscountHandler = async (couponCode) => {
    let url = `${process.env.REACT_APP_BACKEND_HOST}/cart/applyDiscount`;

    console.log(url, couponCode);
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getAuthToken(),
        },
        body: JSON.stringify({ couponCode: couponCode }),
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setrefreshCart(true);
      } else {
      }
    } catch (error) {
      console.log(error, "This is the error from catch block");
    }
  };

  const checkoutHandler = async () => {
    console.log("CHECKOUTING THE CART");
    const token = getAuthToken();
    let url = `${process.env.REACT_APP_BACKEND_HOST}/cart/checkout`;
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const responseData = await response.json();
      if (response.ok) {
        return responseData;
      } else {
        return responseData;
      }
    } catch (error) {
      console.log(error, "This is the error from catch block");
    }
  };

  const cartContext = {
    ...cart,
    totalItems,
    setTotalItems,
    setcart,
    setrefreshCart,
    qtyChangeHandler,
    applyDiscountHandler,
    checkoutHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
