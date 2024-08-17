import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import Backcity from "../assets/Backcity";
import Cameraman from "../assets/Cameraman";
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import Target from "../assets/Target";
import ZoomControls from "./ZoomControls";
import * as THREE from 'three';
import VirtualCamera from "./VirtualCamera";

const DraggableResizableShape = () => {
  const [cameramanPosition, setCameramanPosition] = useState({ x: 50, y: -100 });
  const [isDraggingCameraman, setIsDraggingCameraman] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: window.innerWidth - 200, y: -300 });
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [distanceBetween, setDistanceBetween] = useState(null);
  const [heightDiff, setHeightDiff] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const linesRef = useRef([]);
  const currentLineRef = useRef(null);
  const zoomInRef = useRef(null);
  const zoomOutRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setDistanceBetween(Math.round(targetPosition.x - cameramanPosition.x));
    setHeightDiff(Math.round(targetPosition.y + 350));
  }, [cameramanPosition, targetPosition]);

  const lineStart = {
    x: cameramanPosition.x + 150 + 10, // Adjust based on the width of the cameraman building (half of 150px width)
    y: window.innerHeight - 100, // Adjust based on the height of the building (200px height)
  };

  const lineEnd = {
    x: targetPosition.x + 20 , // Adjust based on the width of the target building (half of 200px width)
    y: window.innerHeight - 100, // Adjust based on the height of the building (400px height)
  };
  const vlineStart = {
    x: targetPosition.x + 20, // Adjust based on the width of the cameraman building (half of 150px width)
    y: window.innerHeight - 120, // Adjust based on the height of the building (200px height)
  };

  const vlineEnd = {
    x: targetPosition.x + 20 , // Adjust based on the width of the target building (half of 200px width)
    y: window.innerHeight - targetPosition.y - 420 , // Adjust based on the height of the building (400px height)
  };

  const handleReset = () => {
    setCameramanPosition({ x: 50, y: -100 });
    setTargetPosition({ x: window.innerWidth - 200, y: -300 });
  };

  const handlePointerMove = useCallback((e) => {
    if (isDraggingCameraman) {
      setCameramanPosition((prev) => ({
        x: e.clientX - 50,
      }));
    } else if (isDraggingTarget) {
      setTargetPosition((prev) => ({
        x: e.clientX - 50,
        y: Math.max(-300, Math.min(0, prev.y - (e.movementY))),
      }));
    } else if (isDrawing && e.point) {
      const { x, y } = e.point;
      if (currentLineRef.current) {
        currentLineRef.current.geometry.vertices.push(new THREE.Vector3(x, y, 0));
        currentLineRef.current.geometry.verticesNeedUpdate = true;
      }
    }
  }, [isDraggingCameraman, isDraggingTarget, isDrawing]);

  const handlePointerDown = (e) => {
    if (isDrawing && e.point) {
      const { x, y } = e.point;
      const geometry = new THREE.BufferGeometry();
      geometry.setFromPoints([new THREE.Vector3(x, y, 0)]);
      const material = new THREE.LineBasicMaterial({ color: 0x000000 });
      const line = new THREE.Line(geometry, material);
      linesRef.current.push(line);
      currentLineRef.current = line;
    }
  };

  const handlePointerUp = () => {
    setIsDraggingCameraman(false);
    setIsDraggingTarget(false);
    currentLineRef.current = null;
  };

  return (
    <div className="w-screen h-screen">
      <Canvas
        className="w-full h-full"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        camera={{ zoom: zoomLevel, position: [0, 0, 5] }}
      >
        <ZoomControls setZoomLevel={setZoomLevel} zoomInRef={zoomInRef} zoomOutRef={zoomOutRef} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Html fullscreen>
          <Navbar isDrawing={isDrawing} setIsDrawing={setIsDrawing} handleReset={handleReset} zoomIn={zoomInRef} zoomOut={zoomOutRef} />
          <div className="absolute inset-0 w-full h-full -z-10">
            <Backcity className="object-cover w-full h-full opacity-65" />
          </div>

          <div className="absolute"
            style={{
                left: `${(lineEnd.x + lineStart.x)/2 -10}px`,
                bottom: "50px" 
            }}
          >
                <h2 className=" bg-gray-700 text-white px-2 rounded-md " >
                {distanceBetween}
            </h2>
          </div> 
          
          <div className="absolute"
            style={{
                left: `${vlineEnd.x -50}px`,
                top: `${(vlineEnd.y + vlineStart.y)/2 + 50}px`
            }}
          >
                <h2 className="bg-gray-700 text-white px-2 rounded-md " >
                {heightDiff}
            </h2>
          </div> 

          <svg className="absolute w-full h-full pointer-events-none opacity-50">
          <defs>
              <marker
                id="arrow-start"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto-start-reverse"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="red" />
              </marker>
              <marker
                id="arrow-end"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="red" />
              </marker>
            </defs>
            <line
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="red"
              strokeWidth="2"
              markerStart="url(#arrow-start)"
              markerEnd="url(#arrow-end)"
            />
          </svg>

          <svg className="absolute w-full h-full pointer-events-none opacity-50">
          <defs>
              <marker
                id="arrow-start"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto-start-reverse"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="red" />
              </marker>
              <marker
                id="arrow-end"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="red" />
              </marker>
            </defs>
            <line
              x1={vlineStart.x}
              y1={vlineStart.y}
              x2={vlineEnd.x}
              y2={vlineEnd.y}
              stroke="red"
              strokeWidth="2"
              markerStart="url(#arrow-start)"
              markerEnd="url(#arrow-end)"
            />
          </svg>

          <div
            className="absolute cursor-move"
            style={{
              left: `${cameramanPosition.x}px`,
              bottom: `${cameramanPosition.y}px`,
              height: "200px",
              width: "150px",
              zIndex: 10,
            }}
            onPointerDown={() => setIsDraggingCameraman(true)}
          >
            <Cameraman className="w-full h-full z-10" />
          </div>
          <div>
            Dist: {distanceBetween} --- Height: {heightDiff}
          </div>
          <div
            className="absolute cursor-move"
            style={{
              left: `${targetPosition.x}px`,
              bottom: `${targetPosition.y}px`,
              height: "400px",
              width: "200px",
              zIndex: 10,
            }}
            onPointerDown={() => setIsDraggingTarget(true)}
          >
            <Target className="w-full h-full z-10" />
          </div>
                  <VirtualCamera cameramanPosition={cameramanPosition} />

        </Html>
        

        {linesRef.current.map((line, index) => (
          <primitive key={index} object={line} />
        ))}


      </Canvas>
    </div>
  );
};

export default DraggableResizableShape;