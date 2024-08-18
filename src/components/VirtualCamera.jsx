import React, { useState, useEffect } from "react";

const VirtualCamera = ({ cameramanPosition, onAngleChange, handleClickImage }) => {
  const [angle, setAngle] = useState(45); // Initial angle (in degrees)
  const [dragging, setDragging] = useState(false);

  // Calculate the camera's central position based on the Cameraman's position
  const cameraPosition = {
    x: cameramanPosition.x + 200, // Your original x offset
    y: window.innerHeight - 215, // Your original y offset
  };

  // Calculate the endpoint of the line based on the angle
  const lineLength = 250; // Length of the draggable line
  const radians = (angle * Math.PI) / 180;
  const lineEnd = {
    x: cameraPosition.x -150 + lineLength * Math.cos(radians),
    y: cameraPosition.y - lineLength * Math.sin(radians),
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      // Calculate the new angle based on mouse position relative to the camera position
      const dx = e.clientX - cameraPosition.x + 75 ;
      const dy = cameraPosition.y - e.clientY + 75; // Inverted y-axis for screen coordinates
      const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Restrict the angle to between 0 and 180 degrees
      if (newAngle >= 0 && newAngle <= 180) {
        setAngle(newAngle);
        onAngleChange(newAngle); // Pass the updated angle to the parent component
      }
    }
  };

  const handleMouseDown = () => {
    const tolerance = 10 ;
    const dx = e.clientX - cameraPosition.x+150;
    const dy = cameraPosition.y - e.clientY ;
    const distanceToLine = Math.abs(dy - dx * Math.tan(radians));

    // Start dragging if the click is close enough to the line
    if (distanceToLine < tolerance) {
      setDragging(true);
    }

    setDragging(true) ;

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

  // Calculate control points for the curve
  const baseMidpoint = {
    x: (cameraPosition.x  + lineEnd.x)/2 - 35 ,
    y : (cameraPosition.y + lineEnd.y)/2 + 25 ,
  }

  // SVG Path for the curve using Bézier curve syntax
  const curvePath = `M${cameraPosition.x -25 },${cameraPosition.y} 
                     Q${baseMidpoint.x},${baseMidpoint.y} 
                      ${(lineEnd.x + cameraPosition.x)/2 -75},${(lineEnd.y + cameraPosition.y)/2}`;

  return (
    <>
      {/*
        <button onClick={handleClickImage} type="button" className="z-50 absolute cursor-pointer bg-gray-800 text-white font-mono rounded-md p-1" style={{bottom:"150px",left:`${cameraPosition.x - 350}px`}} >
        Click Picture
      </button>
      */}

      {/* SVG Visualization */}
        <svg className="w-full h-full opacity-50 z-10">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 Z" fill="black" />
          </marker>
        </defs>
        {/* Base Horizontal Line */}
        <line
          x1={cameraPosition.x - 150}
          y1={cameraPosition.y}
          x2={cameraPosition.x + 100}
          y2={cameraPosition.y}
          stroke="black"
          strokeWidth="2"
        />

        {/* Draggable Rotating Line */}
        <line
          className="cursor-move"
          x1={cameraPosition.x-150}
          y1={cameraPosition.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke="blue"
          strokeWidth="3"
          markerEnd="url(#arrow)"
          onMouseDown={handleMouseDown} // Start dragging on mouse down
        />

         {/* Curve Path */}
         <path
          d={curvePath}
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Invisible Hitbox for Easier Dragging */}
        <line
         className="cursor-move z-10 absolute"
          x1={cameraPosition.x-150}
          y1={cameraPosition.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke="transparent"
          strokeWidth="20" // Increase the stroke width for a larger hitbox
          onMouseDown={handleMouseDown} // Enable dragging within this hitbox
        />

      </svg>

      {/* Angle Display */}
      <div
        className="absolute text-white bg-gray-800 p-2 rounded"
        style={{ left: `${cameraPosition.x - 300}px`, top: `${cameraPosition.y - 25}px` }}
      >
        Angle: {Math.round(angle)}°
      </div>
      
    </>
  );
};

export default VirtualCamera;
