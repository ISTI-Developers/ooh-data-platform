/* eslint-disable react/prop-types */
import axios from "axios";
import React from "react";
import { useContext } from "react";
import { devEndpoints as url } from "./endpoints";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const signInUser = async (username, password) => {
    try {
      const userData = new FormData();

      userData.append("action", "login");
      userData.append("username", username);
      userData.append("password", password);
      const response = await axios.post(url.auth, userData);

      if (response.status === 200) {
        return response.data;
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
  const value = {
    signInUser,
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
