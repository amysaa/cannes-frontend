import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./Products.css";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import ProductCard from "../components/ProductCard/ProductCard";
import SelectCategoryCard from "../components/SelectCategoryCard/SelectCategoryCard";
import CartContext from "../store/cart-context";
import MySlider from "../components/FilterSlider/Slider";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsPage = () => {
  const cartCtx = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const data = useLoaderData();

  const [setselectedCategories, setSetselectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState(10000);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const onChecked = (name) => {
    setSetselectedCategories((prevState) => [...prevState, name]);
  };

  const onUnChecked = (name) => {
    setSetselectedCategories((prevState) =>
      prevState.filter((value) => value !== name)
    );
  };

  const addToCartSuccess = () => {
    setOpen(true);
    cartCtx.setrefreshCart(true);
  };
  const addToCartFailure = () => {};

  const onSliderFilterChangeHandler = (value) => {
    setPriceFilter(value);
  };

  return (
    <div className="Products-Page">
      <div className="Products-Page__filterContainer">
        <p>Filters</p>
        <div className="categories-list">
          <h4>Categories</h4>
          <ul>
            {data.categories.map((item) => (
              <SelectCategoryCard
                key={item.id}
                id={item.id}
                name={item.name}
                onChecked={onChecked}
                onUnchecked={onUnChecked}
              />
            ))}
          </ul>
        </div>
        <br />
        <div className="categories-list">
          <h4>Prices</h4>
          <MySlider onSliderFilterChange={onSliderFilterChangeHandler} />
        </div>
      </div>
      <div className="Products-Page__ProductContainer">
        <ul>
          {data.products
            .filter(
              (item) =>
                setselectedCategories.length === 0 ||
                setselectedCategories.includes(item.category)
            )
            .filter((item) => item.price < priceFilter)
            .map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                url={item.imageUrls[0].secure_url}
                title={item.name}
                price={item.price}
                brand={item.brand}
                addToCartSuccess={addToCartSuccess}
                addToCartFailure={addToCartFailure}
              ></ProductCard>
            ))}
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
    </div>
  );
};

export async function loader({ request, params }) {
  console.log(request.url);

  const urlParams = new URLSearchParams(window.location.search);
  const searchKeyword = urlParams.get("search");

  console.log(searchKeyword);

  let u = "?q=";

  if (searchKeyword && searchKeyword.length > 3) {
    u = u + searchKeyword;
  }

  const response = await fetch(
    process.env.REACT_APP_BACKEND_HOST + "/product" + u
  );

  if (!response.ok) {
    const data = { message: "Coult not fetch Products" };
    throw { isError: true, message: data.message, status: response.status };
  }

  return response;
}

export default ProductsPage;
