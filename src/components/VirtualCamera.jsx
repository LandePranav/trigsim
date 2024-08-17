import React, { useState, useEffect } from "react";

const VirtualCamera = ({ cameramanPosition }) => {
  const [angle, setAngle] = useState(45); // Initial angle (in degrees)
  const [dragging, setDragging] = useState(false);

  // Calculate the camera's central position directly from the cameraman's position
  const cameraPosition = {
    x: cameramanPosition.x + 210, // Your original x offset
    y: window.innerHeight + cameramanPosition.y - 50, // Your original y offset
  };

  // Calculate the endpoint of the line based on the angle
  const lineLength = 200; // Length of the draggable line
  const radians = (angle * Math.PI) / 180;
  const lineEnd = {
    x: cameraPosition.x + lineLength * Math.cos(radians),
    y: cameraPosition.y - lineLength * Math.sin(radians),
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      // Calculate the new angle based on the mouse position relative to the camera position
      const dx = e.clientX - cameraPosition.x;
      const dy = cameraPosition.y - e.clientY; // Inverted y-axis for screen coordinates
      const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Restrict the angle to between 0 and 180 degrees
      if (newAngle >= 0 && newAngle <= 180) {
        setAngle(newAngle);
      }
    }
  };

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      {/* SVG Visualization */}
      <svg className="absolute w-full h-full pointer-events-none">
        {/* Base Horizontal Line */}
        <line
          x1={cameraPosition.x - 150}
          y1={cameraPosition.y}
          x2={cameraPosition.x + 150}
          y2={cameraPosition.y}
          stroke="black"
          strokeWidth="2"
        />

        {/* Draggable Rotating Line */}
        <line
          x1={cameraPosition.x-150}
          y1={cameraPosition.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke="blue"
          strokeWidth="2"
          onMouseDown={handleMouseDown} // Make the line draggable
        />
      </svg>

      {/* Angle Display */}
      <div
        className="absolute text-white bg-gray-800 p-2 rounded"
        style={{ left: `${cameraPosition.x + 50}px`, top: `${cameraPosition.y - 100}px` }}
      >
        Angle: {Math.round(angle)}°
      </div>
    </>
  );
};

export default VirtualCamera;
