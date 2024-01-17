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
  const [alert, setAlert] = useState({
    isOn: false,
    type: "info",
    message: "Sample only",
  });

  const signInUser = async (username, password) => {
    try {
      const response = await axios.post(url.login, {
        username: username,
        password: password,
      });

      console.log(response.data);
      if (response.status === 200) {
        if (response.data.id) {
          Cookies.set("user", JSON.stringify(response.data));
          setUser(response.data);
          return { acknowledged: true };
        }
      }
    } catch (e) {
      return e.response.data;
    }
  };
  const registerUser = async (user) => {
    try {
      const response = await axios.post(url.register, user, {
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
    Cookies.remove("siteCache");
    setUser(null);
    navigate("/login");
  };
  const value = {
    user,
    alert,
    setAlert,
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
