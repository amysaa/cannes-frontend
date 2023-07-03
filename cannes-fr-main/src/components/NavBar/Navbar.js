import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "../../Assets/logo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsCart, BsPerson } from "react-icons/bs";
import AuthContext from "../../store/auth-context";
import CartContext from "../../store/cart-context";

import { motion } from "framer-motion";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);

  const location = useLocation();

  const pathName = location.pathname;

  const isAuthPage = pathName.includes("auth");

  const navigate = useNavigate();

  const [toggleMenu, setToggleMenu] = useState(false);

  const menuRef = useRef();

  const toggleClickHandler = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setToggleMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar__container">
        {/* {isHome && <CustomSnackbar onClose={onSnackbarCloseHandler} />} */}
        <div className="app__navbar">
          <div className="app__navbar-logo">
            <NavLink to={"/"}>
              <img alt="Brand Logo" src={logo}></img>
            </NavLink>
            {authCtx.name.split(" ")[0] && (
              <div className="app__navbar-name">
                Hello, {authCtx.name.split(" ")[0]}
              </div>
            )}
          </div>
          <div className="app__navbar-links">
            {!isAuthPage && (
              <input
                className="search-input"
                placeholder="Search"
                name="q"
                onKeyDown={(event) => {
                  console.log(event.key);
                  if (event.key === "Enter" && event.target.value.length > 3) {
                    console.log(event.target.value);
                    navigate("/products" + "?search=" + event.target.value);
                  }
                }}
              />
            )}
            {!isAuthPage && (
              <NavLink className="app__navbar-link" to={"/cart"}>
                <div className="cart-icon">
                  <BsCart className="icon" size={20} />
                  <span>{cartCtx.totalItems}</span>
                </div>
              </NavLink>
            )}

            {!isAuthPage && !authCtx._id && (
              <NavLink className="app__navbar-link" to={"/auth/login"}>
                <BsPerson className="icon" size={20} />
              </NavLink>
            )}
            {authCtx._id && (
              <div className="app__navbar-link ">
                <div className="profile-icon" onClick={toggleClickHandler}>
                  {authCtx.name.slice(0, 1)}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {toggleMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: [0, 0.5, 1] }}
          animate={{ opacity: 1 }}
          transition={{ x: [-100, 0] }}
          ref={menuRef}
          className={`toggle-menu ${toggleMenu ? "open" : ""}`}
        >
          <ul>
            <div className="toggle-menu__name" key={0}>
              {authCtx.name}
            </div>
            <div className="toggle-menu__email" key={1}>
              {authCtx.email}
            </div>
            <li
              key={2}
              onClick={() => {
                navigate("account");
              }}
            >
              Account
            </li>
            <li
              key={3}
              onClick={() => {
                navigate("orders");
              }}
            >
              Orders
            </li>

            <form
              method="GET"
              action={`${`${process.env.REACT_APP_BACKEND_HOST}/auth/logout`}`}
            >
              <li key={3}>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("expiration");
                  }}
                  type="submit"
                >
                  Logout
                </button>
              </li>
            </form>
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
