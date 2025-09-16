import classNames from "classnames";
import PropTypes from "prop-types";

function Title({ name, className, children }) {
  return (
    <div
      className={classNames(
        "font-bold text-xl text-main flex items-center gap-1",
        className
      )}
    >
      {name}
      {children}
    </div>
  );
}

Title.propTypes = {
  name: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Title;
