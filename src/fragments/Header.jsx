import classNames from "classnames";
import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/unai.png";
import PropTypes from "prop-types";
import useUser from "../config/userStore";

function Header() {
  const location = useLocation();
  const user = useUser((state) => state.user);
  const logoutUser = useUser((state) => state.clearUser);

  return (
    <>
      <Navbar
        theme={{
          root: {
            base: "bg-white p-4 pb-2 dark:border-gray-700 dark:bg-gray-800 sm:px-4 shadow-md",
          },
          collapse: {
            base: "w-full md:block md:w-auto animate-fade",
          },

          toggle: {
            base: "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-transparent hover:outline-none focus:outline-none focus:ring-0 focus:ring-none md:hidden",
          },
        }}
        border
      >
        <Navbar.Brand>
          <img
            src={logo}
            alt="United Neon Advertising Inc."
            className="w-full max-w-[200px]"
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {["", "map", "audience"].map((item, index) => {
            return (
              <Navbar.Link
                href={`/${item}`}
                key={index}
                className={classNames(
                  "capitalize font-semibold text-lg hover:text-secondary",
                  location.pathname == `/${item}`
                    ? "text-secondary"
                    : "text-main"
                )}
              >
                {item === "" ? "planning" : item}
              </Navbar.Link>
            );
          })}
          {user ? (
            <button
              className="capitalize font-semibold text-lg text-main hover:text-secondary pl-3 pt-2 md:p-0"
              onClick={() => logoutUser()}
            >
              Logout
            </button>
          ) : (
            <>
              {location.pathname !== "/login" ? (
                <Link
                  to="/login"
                  className="capitalize font-semibold text-lg text-main hover:text-secondary pl-3 pt-2 md:p-0"
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="capitalize font-semibold text-lg text-main hover:text-secondary pl-3 pt-2 md:p-0"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};
export default Header;
