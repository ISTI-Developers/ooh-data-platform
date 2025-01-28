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
      const { admin } = response.role;
      if (admin) {
        window.location.href = adminURL;
      } else {
        window.location.href = "/";
      }
      // if (response.role.permissions.admin.access) {
      //   window.location.href = adminURL;
      // } else {
      //   const pages = response.role.permissions.client.modules;
      //   const filteredResults = {};
      //   for (const [key, value] of Object.entries(pages)) {
      //     if (value.view) {
      //       filteredResults[key] = value;
      //     }
      //   }
      //   const page = Object.keys(filteredResults);
      //   if (page.length !== 0) {
      //     if (page[0] === "planning") {
      //       navigate("/");
      //     } else {
      //       navigate(`/${page[0].substring(0, page[0].length - 1)}`);
      //     }
      //   }
      // }
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: response?.data?.message,
      });
      toggleSending((prev) => !prev);
    }
  };

  useEffect(() => {
    if (user) {
      const roleCookie = Cookies.get("role") || null;
      if (roleCookie) {
        if (JSON.parse(Cookies.get("role")).admin) {
          window.location.href = adminURL;
        } else {
          navigate("/");
        }
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
                {isSending ? (
                  <div role="status">
                    <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <>Log in</>
                )}
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
