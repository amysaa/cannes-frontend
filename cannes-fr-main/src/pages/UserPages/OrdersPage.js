import React from "react";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import "./OrdersPage.css";
import { getAuthToken } from "../../utils/isAuth";
import { useLoaderData } from "react-router-dom";
import { AiOutlineClockCircle, AiFillCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
const OrdersPage = () => {
  const data = useLoaderData();
  console.log(data.orders);

  const downloadInvoiceHandler = async (id) => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_HOST + "/user/order/" + id + "/invoice",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer " + getAuthToken(),
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      saveAs(blob, "invoice.pdf");
    }
  };

  return (
    <div className="OrdersPage">
      <h1 style={{ textAlign: "center" }}>Your orders</h1>
      <ul>
        {data.orders &&
          data.orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item) => (
              <motion.div
                whileInView={{ opacity: [0, 1] }}
                transition={{ duration: 1 }}
                className="OrderCard "
                key={item._id}
              >
                <div className={`OrderCard__orderId`}>
                  <h5>Order Id : </h5>
                  <div> {item._id}</div>
                </div>
                <div>{convertUtctoLocal(item.createdAt)}</div>
                <div className="OrderCard__status">
                  <h5>Status : </h5>
                  <div>
                    {item.status === "PENDING" && <AiOutlineClockCircle />}
                    {item.status === "SHIPPED" && <BiPackage />}
                    {item.status === "DELIVERED" && <BiPackage />}
                    {item.status === "CANCELLED" && <MdCancel />} {item.status}
                  </div>
                </div>
                <hr></hr>
                <div className="OrderCard-productsList">
                  <h5>Products</h5>
                  {item.products.map((item) => {
                    if (item.product.name.length > 15) {
                      item.product.name = item.product.name.substring(0, 23);
                    }
                    return (
                      <li>
                        {item.product.name} x {item.quantity}
                      </li>
                    );
                  })}
                </div>
                <hr></hr>
                <div>Rs.{item.totalAmount}</div>
                <div>
                  {item.shippingAddress.street}, {item.shippingAddress.city}
                </div>
                <br />
                <div>
                  <button
                    type="button"
                    className="Download-Invoice-btn"
                    onClick={downloadInvoiceHandler.bind(null, item._id)}
                  >
                    Download Invoice
                  </button>
                </div>
              </motion.div>
            ))}
      </ul>
    </div>
  );
};

const convertUtctoLocal = (str) => {
  const date = new Date(str);

  const day = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" }); // Month value is zero-based, so adding 1
  const year = date.getFullYear();
  return `${day}, ${monthName}, ${year}`;
};

export async function loader() {
  const token = getAuthToken();
  const response = await fetch(
    process.env.REACT_APP_BACKEND_HOST + "/user/orders",
    {
      credentials: "include",
      headers: token
        ? {
            Authorization: "Bearer " + token,
          }
        : {},
    }
  );
  if (!response.ok) {
    const data = { message: "Coult not fetch Profile" };
    throw { isError: true, message: data.message, status: response.status };
  }

  return response;
}

export default OrdersPage;
