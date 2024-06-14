import { Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import {
  defaultTextTheme,
  mainButtonTheme,
  passwordFieldTheme,
} from "../config/themes";
import { useAuth } from "../config/authContext";
import Cookies from "js-cookie";

function Login() {
  const { user, signInUser, setAlert } = useAuth();
  const navigate = useNavigate();

  const [show, toggleShow] = useState(false);
  const [isFocus, toggleFocus] = useState(false);
  const [isSending, toggleSending] = useState(false);
  const username = useRef(null);
  const password = useRef(null);
  // const domain = window.location.hostname;
  const adminURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5174"
      : "https://ooh-ad.scmiph.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    toggleSending((prev) => !prev);
    const uname = username.current.value;
    const pass = password.current.value;

    const response = await signInUser(uname, pass);
    if (response?.acknowledged) {
      if (response.role.permissions.admin.access) {
        window.location.href = adminURL;
      } else {
        const pages = response.role.permissions.client.modules;
        console.log(pages);
        const filteredResults = {};
        for (const [key, value] of Object.entries(pages)) {
          if (value.view) {
            filteredResults[key] = value;
          }
        }
        const page = Object.keys(filteredResults);
        if (page.length !== 0) {
          if (page[0] === "planning") {
            navigate("/");
          } else {
            navigate(`/${page[0].substring(0, page[0].length - 1)}`);
          }
        }
        // if (response.role.permissions.client.modules.planning.view) {
        //   navigate("/");
        // } else {
        // }
      }
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: response.message,
      });
      toggleSending((prev) => !prev);
    }
  };

  useEffect(() => {
    if (user) {
      if (JSON.parse(Cookies.get("role")).permissions.admin.access) {
        window.location.href = adminURL;
      } else {
        navigate("/");
      }
    }
  }, [navigate, user]);
  return (
    !user && (
      <div className="flex items-center justify-center h-full -translate-y-[75px]">
        <div className="max-w-sm w-full bg-white shadow flex flex-col items-center p-4 gap-4">
          <header className="w-full pb-2 border-b">
            <p className="text-2xl font-semibold">Login</p>
            {/* <p>Stay informed about your Out-of-Home Advertising </p> */}
          </header>
          <main className="w-full flex flex-col gap-4">
            <form
              method="POST"
              className="flex flex-col gap-4"
              onSubmit={handleLogin}
            >
              <div>
                <TextInput
                  id="username"
                  required
                  size="md"
                  defaultValue=""
                  placeholder="Username"
                  ref={username}
                  theme={defaultTextTheme}
                />
              </div>
              <div
                className={classNames(
                  "flex items-center border ",
                  isFocus ? "border-cyan-500" : "border-gray-300"
                )}
              >
                <TextInput
                  id="password"
                  required
                  type={show ? "text" : "password"}
                  size="md"
                  className="w-full"
                  defaultValue=""
                  placeholder="Password"
                  ref={password}
                  onFocus={() => toggleFocus(true)}
                  onBlur={() => toggleFocus(false)}
                  theme={passwordFieldTheme}
                />
                <button
                  type="button"
                  onFocus={() => toggleFocus(true)}
                  onBlur={() => toggleFocus(false)}
                  className="text-sm px-2 min-w-[50px] outline-none"
                  onClick={() => toggleShow((prev) => !prev)}
                >
                  {show ? "hide" : "show"}
                </button>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-secondary w-fit"
              >
                Forgot Password?
              </Link>
              <Button
                type="submit"
                color="light"
                theme={mainButtonTheme}
                disabled={isSending}
              >
                Log in
              </Button>
            </form>
          </main>
          <div className="text-sm">
            Need an account?{" "}
            <Link to="/register" className="text-secondary">
              Register Now!
            </Link>
          </div>
        </div>
      </div>
    )
  );
}

export default Login;
