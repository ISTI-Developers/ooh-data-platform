import classNames from "classnames";
import PropTypes from "prop-types";

function Title({ name, className }) {
  return (
    <div className={classNames("font-semibold text-2xl text-main", className)}>
      {name}
    </div>
  );
}

Title.propTypes = {
  name: PropTypes.node,
  className: PropTypes.string,
};

export default Title;
