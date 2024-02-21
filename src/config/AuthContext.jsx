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

      // console.log(response.data);
      if (response.status === 200) {
        if (response.data.id) {
          const { role_id } = response.data;
          const role = await retrieveRole(role_id);
          console.log(role_id, role);
          Cookies.set("role", JSON.stringify(role), {
            domain: "localhost",
          });
          Cookies.set("user", JSON.stringify(response.data), {
            domain: "localhost",
          });
          setUser(response.data);
          return { acknowledged: true, role: role };
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
  const retrieveRole = async (id) => {
    try {
      const response = await axios.get(url.roles, {
        params: {
          id: id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
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
  }, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
