import classNames from "classnames";
import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useUser from "../config/userStore";

function Header() {
  const location = useLocation();
  const user = useUser((state) => state.user);
  const logoutUser = useUser((state) => state.clearUser);

  return (
    <header className="bg-white shadow-xl ">
      <Navbar>
        <Navbar.Brand>
          <img
            src="https://www.unitedneon.com/web/wp-content/uploads/2018/01/logo.png"
            alt="United Neon Advertising Inc."
          />
        </Navbar.Brand>
        <div className="flex items-center gap-10">
          {["", "map", "audience", "reports"].map((item, index) => {
            return (
              <Link
                to={`/${item}`}
                key={index}
                className={classNames(
                  "capitalize font-semibold text-lg hover:text-secondary",
                  location.pathname == `/${item}`
                    ? "text-secondary"
                    : "text-main"
                )}
              >
                {item === "" ? "planning" : item}
              </Link>
            );
          })}
          {user ? (
            <button
              className="capitalize font-semibold text-lg text-main hover:text-secondary"
              onClick={() => logoutUser()}
            >
              Logout
            </button>
          ) : (
            <>
              {location.pathname !== "/login" ? (
                <Link
                  to="/login"
                  className="capitalize font-semibold text-lg text-main hover:text-secondary"
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="capitalize font-semibold text-lg text-main hover:text-secondary"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </Navbar>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};
export default Header;
