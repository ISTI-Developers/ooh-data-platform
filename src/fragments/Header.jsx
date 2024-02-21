import classNames from "classnames";
import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/scmi.png";
import PropTypes from "prop-types";
import { navbarTheme } from "../config/themes";
import { useAuth } from "../config/authContext";

function Header() {
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  return (
    <>
      <Navbar theme={navbarTheme} border>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="United Neon Advertising Inc."
            className="w-full max-w-[200px]"
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {/* Mapping of links for navigation bar */}
          {user &&
            ["", "map", "audience"].map((item, index) => {
              return (
                <Link
                  to={`/${item}`}
                  key={index}
                  className={classNames(
                    "capitalize font-semibold text-lg hover:text-secondary",
                    //check if same pathname to the item for showing the active link
                    location.pathname == `/${item}`
                      ? "text-secondary"
                      : "text-main"
                  )}
                >
                  {/* planning page is the home of the system so it checks if the item == "" */}
                  {item === "" ? "planning" : item}
                </Link>
              );
            })}
          {/* conditional rendering if user has logged in or not */}
          {user ? (
            <button
              className="capitalize font-semibold text-lg text-main hover:text-secondary pl-3 pt-2 md:p-0"
              onClick={() => logoutUser()}
            >
              Logout
            </button>
          ) : (
            <>
              {/* conditional rendering for when the user is in login or register pages */}
              {location.pathname !== "/login" ? (
                <UserAccessLink to="login" />
              ) : (
                <UserAccessLink to="register" />
              )}
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
// component used to render the login and register links
const UserAccessLink = ({ to }) => {
  return (
    <a
      href={`/${to}`}
      className="capitalize font-semibold text-lg text-main hover:text-secondary pl-3 pt-2 md:p-0"
    >
      {to}
    </a>
  );
};

UserAccessLink.propTypes = {
  to: PropTypes.string,
};
Header.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};
export default Header;
