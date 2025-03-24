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
  const domain =
    window.location.hostname == "localhost" ? "localhost" : "scmiph.com";

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [roleID, setRoleID] = useState(null);
  const [modules, setModules] = useState([]);
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

      if (response.status === 200) {
        if (response.data.id) {
          Cookies.set("token", response.data?.token, {
            domain: domain,
          });
          const { role_id } = response.data;
          try {
            Cookies.set("role", role_id, {
              domain: domain === "localhost" ? domain : "." + domain,
            });

            Cookies.set("user", JSON.stringify(response.data), {
              domain: domain === "localhost" ? domain : "." + domain,
            });
            setUser(response.data);
            return { acknowledged: true, role: role_id };
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        }
      }
    } catch (e) {
      return e.response;
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
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const retrieveRoleModules = async () => {
    try {
      const response = await axios.get(url.modules, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };
  const logoutUser = () => {
    console.log(Cookies.get("user"), Cookies.get("role"));
    Cookies.remove("user", { domain: domain });
    Cookies.remove("role", { domain: domain });
    Cookies.remove("siteCache", { domain: domain });
    setUser(null);
    setRole(null);
    console.log(Cookies.get("user"), Cookies.get("role"));
    navigate("/login");
  };
  const verifyEmail = async (email) => {
    try {
      const response = await axios.post(
        url.email,
        { email_address: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (e) {
      console.log(e);
      if (e.response.data) {
        return e.response.data;
      }
    }
  };
  const changePassword = async (id, password) => {
    try {
      const response = await axios.patch(
        url.password,
        { id: id, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (e) {
      console.log(e);
      if (e.response.data) {
        return e.response.data;
      }
    }
  };
  // Function to check permission for a given path
  function CheckPermission({ path, children }) {
    const modules = role ? role.access : null;

    if (!modules) return null;

    // Find the module with the given path
    const permission = modules.find(
      (module) => module.name.toLowerCase() === path
    );

    // If permission exists and has view access, render children
    if (permission && permission.permissions[0]) {
      return <>{children}</>;
    }

    return null;
  }

  // Function to check if any link in the array is viewable
  function isViewable(array) {
    const modules = role ? role.access : null;

    if (!modules) return false;

    // Check if any link in the array has view permission
    return array.some((link) => {
      const permission = modules.find(
        (module) => module.name.toLowerCase() === link
      );

      return permission && permission.permissions[0];
    });
  }
  const value = {
    user,
    role,
    alert,
    setAlert,
    signInUser,
    registerUser,
    logoutUser,
    verifyEmail,
    changePassword,
    retrieveRoleModules,
    CheckPermission,
    isViewable,
  };

  useEffect(() => {
    if (Cookies.get("user") && Cookies.get("role")) {
      setUser(JSON.parse(Cookies.get("user")));
      setRoleID(Cookies.get("role"));
    } else {
      if (
        !["/login", "/register", "/forgot-password", "/password-recovery"].some(
          (path) => location.pathname.startsWith(path)
        )
      ) {
        navigate("/login");
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    // console.log(roleID);

    const getRole = async () => {
      const userRole = await retrieveRole(roleID);
      setRole(userRole);
    };
    if (roleID) {
      getRole();
    }
  }, [roleID]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
