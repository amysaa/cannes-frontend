import React from "react";
import { motion } from "framer-motion";
import { getAuthToken } from "../../utils/isAuth";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

import { MdVerified } from "react-icons/md";
import "./Profile.css";
import Loader from "../../components/Loader/Loader";

const ProfilePage = () => {
  const data = useLoaderData();

  const actionData = useActionData();
  console.log(actionData);

  const navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";

  let errorMessage = "Invalid Details";

  let isError = false;

  if (actionData && actionData.status && actionData.status === "ERROR") {
    isError = true;
    errorMessage = actionData.message;
    console.log(actionData);
  }

  return (
    <div className="ProfilePage">
      <motion.div
        whileInView={{ opacity: [0, 1], y: [-50, 0], x: [50, 0] }}
        transition={{ duration: 1 }}
        className="ProfilePage-name"
      >
        {data.user.name}
      </motion.div>
      <div className="ProfilePage-email">
        <p>{data.user.email}</p>
        <div>
          <MdVerified color="green" />
        </div>
      </div>
      <br />
      <br />
      <motion.div
        whileInView={{ opacity: [0, 1] }}
        transition={{ duration: 1 }}
        className="Address-Section"
      >
        <h2>Your Adress</h2>
        <Form
          method={data.user.address ? "PUT" : "POST"}
          className="Address-form"
        >
          {isError && <div className="error-msg">{errorMessage}</div>}
          {actionData && actionData.status === "SUCCESS" && (
            <div className="success-msg">Address Updated</div>
          )}
          <input
            defaultValue={data.user.address && data.user.address.street}
            name="street"
            placeholder="Street"
          />
          <input
            defaultValue={data.user.address && data.user.address.city}
            name="city"
            placeholder="City"
          />
          <input
            defaultValue={data.user.address && data.user.address.postalCode}
            name="postalCode"
            placeholder="Postal Code"
          />
          <input
            defaultValue={data.user.address && data.user.address.state}
            name="state"
            placeholder="State"
          />
          <input
            defaultValue={data.user.address && data.user.address.country}
            name="country"
            placeholder="Country"
          />
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader /> : <> Add Address</>}
          </button>
        </Form>
      </motion.div>
    </div>
  );
};

export async function loader({ request, params }) {
  const token = getAuthToken();
  const response = await fetch(process.env.REACT_APP_BACKEND_HOST + "/user", {
    credentials: "include",
    headers: token
      ? {
          Authorization: "Bearer " + token,
        }
      : {},
  });
  if (!response.ok) {
    const data = { message: "Coult not fetch Profile" };
    throw { isError: true, message: data.message, status: response.status };
  }

  return response;
}

export async function action({ request, params }) {
  const data = await request.formData();

  const addressData = {
    street: data.get("street"),
    city: data.get("city"),
    postalCode: data.get("postalCode"),
    state: data.get("state"),
    country: data.get("country"),
  };
  console.log(addressData, "This is the method bete the sqaww");

  const token = getAuthToken();
  const response = await fetch(
    process.env.REACT_APP_BACKEND_HOST + "/user/address",
    {
      credentials: "include",
      method: request.method,
      headers: token
        ? {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    }
  );

  if (response.status === 500) {
    const data = { message: "Coult not fetch Profile" };
    throw { isError: true, message: data.message, status: response.status };
  }

  if (
    response.status === 422 ||
    response.status === 401 ||
    response.status === 404
  ) {
    return response;
  }

  return response;
}

export default ProfilePage;
