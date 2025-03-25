import classNames from "classnames";
import { Navbar } from "flowbite-react";
import { Link, useLocation, NavLink } from "react-router-dom";
import logo from "~assets/scmi.png";
import PropTypes from "prop-types";
import { navbarTheme } from "~config/themes";
import { useAuth } from "~config/authContext";
import { useEffect, useMemo, useState } from "react";

function Header() {
  const location = useLocation();
  const { user, logoutUser, CheckPermission, role, retrieveRoleModules } =
    useAuth();
  const [modules, setModules] = useState(null);

  useEffect(() => {
    if (!role) return;
    const retrieve = async () => {
      const response = await retrieveRoleModules();
      setModules(response);
    };
    retrieve();
  }, [role]);

  const pages = useMemo(() => {
    if (!modules) return [];
    return modules
      .filter((module) => module.view === "client" && module.is_parent)
      .filter((module) => {
        return CheckPermission({
          path: module.name.toLowerCase(),
        });
      });
  }, [CheckPermission, modules]);
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
            pages.map((item, index) => {
              const pathName = item.name.toLowerCase();
              return (
                <CheckPermission
                  key={`${index}_${item.module_id}`}
                  path={pathName}
                >
                  <NavLink
                    to={index === 0 ? "/" : `/${pathName}`}
                    className={({ isActive }) =>
                      classNames(
                        "capitalize font-semibold text-lg hover:text-secondary",
                        isActive ? "text-secondary" : "text-main"
                      )
                    }
                  >
                    {pathName}
                  </NavLink>
                </CheckPermission>
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
            <UserAccessLink
              to={location.pathname !== "/login" ? "login" : "register"}
            />
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

// component used to render the login and register links
const UserAccessLink = ({ to }) => {
  return (
    <Link
      to={`/${to}`}
      className="capitalize font-semibold text-lg text-main hover:text-secondary pl-3 pt-2 md:p-0"
    >
      {to}
    </Link>
  );
};

UserAccessLink.propTypes = {
  to: PropTypes.string.isRequired,
};

Header.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default Header;
