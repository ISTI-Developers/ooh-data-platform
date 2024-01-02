import PropTypes from "prop-types";
import { TextInput } from "flowbite-react";
import { useFunction } from "../config/functions";
import { defaultTextTheme } from "../config/themes";

function TextField({ id, type = "text", item, onChange }) {
  const { capitalize } = useFunction();
  return (
    <TextInput
      id={id}
      type={type}
      required
      value={item[id]}
      size="md"
      onChange={onChange}
      placeholder={capitalize(id, "_")}
      theme={defaultTextTheme}
    />
  );
}

TextField.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  item: PropTypes.object,
  onChange: PropTypes.func,
};

export default TextField;
