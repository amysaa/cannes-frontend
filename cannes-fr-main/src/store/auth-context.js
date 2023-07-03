import React from "react";

const AuthContext = React.createContext({
  name: "",
  email: "",
  imageUrl: "",
});

export default AuthContext;
