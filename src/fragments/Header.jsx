import classNames from "classnames";
import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

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
                  "capitalize font-semibold text-lg",
                  location.pathname == `/${item}`
                    ? "text-secondary"
                    : "text-main"
                )}
              >
                {item === "" ? "planning" : item}
              </Link>
            );
          })}
        </div>
      </Navbar>
    </header>
  );
}

export default Header;
