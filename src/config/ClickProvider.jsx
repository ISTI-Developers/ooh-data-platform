/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
const ClickContext = createContext();

export function useClick() {
  return useContext(ClickContext);
}

export function ClickProvider({ children }) {
  const [position, setPosition] = useState([0, 0]);

  const isInside = (rect) => {
    const [pageX, pageY] = position;
    return (
      pageX >= rect.left &&
      pageX <= rect.right &&
      pageY >= rect.top &&
      pageY <= rect.bottom
    );
  };

  useEffect(() => {
    // Add event listener for clicks
    const handleClick = (event) => {
      setPosition([event.pageX, event.pageY]);
    };

    const handleDocumentClick = (event) => {
      // console.log(event.target, event.target.matches("#react-select"));
    };

    // Attach the event listener to the window
    window.addEventListener("click", handleClick);
    document.addEventListener("click", handleDocumentClick);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const value = {
    position,
    isInside,
  };

  return (
    <ClickContext.Provider value={value}>{children}</ClickContext.Provider>
  );
}
