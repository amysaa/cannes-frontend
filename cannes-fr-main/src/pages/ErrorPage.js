import React from "react";
import "./ErrorPage.css";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  console.log(error);

  let title = "An error occured!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.message;
  }

  if (error.status === 404) {
    title = "Not Found!";
    message = "Could not find resource or page";
  }

  return (
    <div className="Error__page">
      <p className="Error__page-title">{title}</p>
      <p className="Error__page-subtitle">{message}</p>
    </div>
  );
};

export default ErrorPage;
