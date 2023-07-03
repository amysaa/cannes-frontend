import React from "react";

import "./SignupPage.css";
import { Form, NavLink, useActionData, useNavigation } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { FcGoogle } from "react-icons/fc";

const SignupPage = () => {
  const navigation = useNavigation();

  let errorMessage = "Invalid email";

  let isError = false;

  let showMessageBox = false;

  const data = useActionData();

  console.log(data, "///////////");

  if (data && data.status && data.status === "ERROR") {
    showMessageBox = true;
    isError = true;
    errorMessage = data.errorMessage;
  }
  if (data && data.status && data.status === "SUCCESS") {
    showMessageBox = true;
    errorMessage = data.message;
  }

  let msgClass = isError ? "error-msg" : "success-msg";
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="signup">
      <div className="signup__image">
        Online shopping is transforming the retail landscape, bringing
        convenience and endless possibilities right to your fingertips.
      </div>
      <div className="signup__form">
        <Form method="POST" className="form">
          <p className="form-title">Create an account</p>
          <p className="signup-link">Let's get started</p>
          {showMessageBox && <div className={msgClass}>{errorMessage}</div>}
          <div className="input-container">
            <input placeholder="Enter name" required type="text" name="name" />
          </div>
          <div className="input-container">
            <input
              placeholder="Enter email"
              required
              type="email"
              name="email"
            />
          </div>
          <div className="input-container">
            <input
              placeholder="Enter password"
              required
              type="password"
              name="password"
            />
          </div>
          <button disabled={isSubmitting} className="submit" type="submit">
            <center style={{ backgroundColor: "transparent" }}>
              {isSubmitting ? <Loader /> : "Create Account"}
            </center>
          </button>
        </Form>
        <form action={`${`${process.env.REACT_APP_BACKEND_HOST}/auth/google`}`}>
          <button className="submit social" type="submit">
            <FcGoogle size={25} className="google-icons" />
            Continue with Google
          </button>
        </form>
        <hr />
        <p className="login-link">
          Already have an account?
          <NavLink to="/auth/login"> Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    }
  );

  if (
    response.status === 422 ||
    response.status === 401 ||
    response.status === 404
  ) {
    return response;
  }

  if (!response.ok) {
    const data = { message: "Could not signup user." };
    throw { isError: true, message: data.message, status: response.status };
  }

  return response;
}
