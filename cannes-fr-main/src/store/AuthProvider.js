import { useEffect, useState } from "react";

import AuthContext from "./auth-context";
import { getAuthToken } from "../utils/isAuth";

const AuthProvider = (props) => {
  const [userProfile, setUserProfile] = useState({
    userId: "",
    name: "",
    email: "",
    imageUrl: "",
  });

  const authContext = {
    ...userProfile,
    setUserProfile,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
