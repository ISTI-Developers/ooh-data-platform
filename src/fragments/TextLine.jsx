import React from "react";
import PropTypes from "prop-types";

function TextLine({ content }) {
  return (
    <div className="relative border">
      <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-fit whitespace-nowrap px-2 text-sm bg-white text-gray-600">
        {content}
      </p>
    </div>
  );
}

TextLine.propTypes = {
  content: PropTypes.node,
};

export default TextLine;
