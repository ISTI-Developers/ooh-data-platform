/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { devEndpoints as url } from "./endpoints";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const signInUser = async (username, password) => {
    try {
      const userData = new FormData();

      userData.append("action", "login");
      userData.append("username", username);
      userData.append("password", password);
      const response = await axios.post(url.auth, userData);

      console.log(response.data);
      if (response.status === 200) {
        if (response.data.ID) {
          Cookies.set("user", JSON.stringify(response.data));
          setUser(response.data);
          return { acknowledged: true };
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const registerUser = async () => {
    try {
      const userData = new FormData();

      userData.append("action", "login");
      const response = await axios.post(url.auth, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  const logoutUser = () => {
    Cookies.remove("user");
    setUser(null);
    navigate("/login");
  };
  const value = {
    user,
    signInUser,
    registerUser,
    logoutUser,
  };

  useEffect(() => {
    if (Cookies.get("user")) {
      setUser(JSON.parse(Cookies.get("user")));
    } else {
      if (!["/login", "/register"].includes(location.pathname))
        navigate("/login");
    }
  }, [location.pathname]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
