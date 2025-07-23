import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import logo from "~assets/scmi.png";
import PropTypes from "prop-types";
import { useAuth } from "~config/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { MdLogout } from "react-icons/md";
import { IoMdKey } from "react-icons/io";
import { useFunction } from "~config/functions";

function Header() {
  const location = useLocation();
  const { capitalize } = useFunction();
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
    <header className="container flex justify-between items-center mx-auto py-2">
      <Link to="/">
        <img
          src={logo}
          alt="United Neon Advertising Inc."
          className="w-full max-w-[200px]"
        />
      </Link>
      <div className="flex items-center gap-8">
        {user &&
          pages.map((item, index) => {
            const pathName = item.name.toLowerCase();
            const isActive =
              location.pathname === "/" && index === 0
                ? true
                : location.pathname.includes(pathName);
            return (
              <CheckPermission
                key={`${index}_${item.module_id}`}
                path={pathName}
              >
                <Link
                  to={index === 0 ? "/" : `/${pathName}`}
                  className={classNames(
                    "font-semibold hover:text-secondary animate-fade",
                    isActive ? "text-secondary underline" : "text-main"
                  )}
                >
                  {capitalize(item.name,"_")}
                </Link>
              </CheckPermission>
            );
          })}
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          {role && role.admin && (
            <Link
              to="https://ooh-ad.scmiph.com/"
              className="border border-main-300 text-white bg-main-300 hover:bg-main-500 p-1.5 px-3 rounded-full text-sm min-w-[100px] flex items-center gap-1.5 pl-3  transition-all duration-300 animate-fade"
            >
              <IoMdKey />
              <span>Admin Panel</span>
            </Link>
          )}
          <button
            className="capitalize border border-red-400 text-red-400 bg-white hover:bg-red-100 rounded-full p-1.5 px-3 text-sm min-w-[100px] flex items-center gap-1 pl-4 transition-all duration-300"
            onClick={logoutUser}
          >
            <MdLogout />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <UserAccessLink
          to={location.pathname !== "/login" ? "login" : "register"}
        />
      )}
    </header>
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
