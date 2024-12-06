import { useState, useRef } from "react";

const DragToScroll = ({ children }) => {
  const scrollRef = useRef(null); // Ref to the scrollable container
  const [isDragging, setIsDragging] = useState(false); // To track if the user is dragging
  const [startX, setStartX] = useState(0); // To store the starting x position
  const [scrollLeft, setScrollLeft] = useState(0); // To store the initial scroll position

  // Function to handle mouse down event
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX); // Store the initial mouse position
    setScrollLeft(scrollRef.current.scrollLeft); // Store the initial scroll position
  };

  // Function to handle mouse move event
  const handleMouseMove = (e) => {
    console.log(isDragging);
    if (!isDragging) return;

    const x = e.clientX;
    const walk = (x - startX) * 2; // Calculate the distance moved by the mouse
    scrollRef.current.scrollLeft = scrollLeft - walk; // Update scroll position
  };

  // Function to handle mouse up or mouse leave event
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false); // Stop dragging when mouse leaves
  };

  return (
    <div
      ref={scrollRef}
      style={{
        overflow: "auto", // Enable scrolling
        cursor: isDragging ? "grabbing" : "grab", // Change cursor while dragging
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default DragToScroll;
