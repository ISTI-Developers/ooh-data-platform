import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TextInput } from "flowbite-react";
import { useFunction } from "~config/functions";
import { passwordFieldTheme } from "~config/themes";

function PasswordField({ id, item, onChange }) {
  const { capitalize } = useFunction();
  const [show, toggleShow] = useState(false);
  const [isFocus, toggleFocus] = useState(false);
  return (
    <div
      className={classNames(
        "flex items-center border ",
        isFocus ? "border-cyan-500" : "border-gray-300"
      )}
    >
      <TextInput
        id={id}
        value={item[id]}
        required
        type={show ? "text" : "password"}
        size="md"
        className="w-full"
        onChange={onChange}
        placeholder={capitalize(id, "_")}
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
  );
}

PasswordField.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object,
  onChange: PropTypes.func,
};

export default PasswordField;
