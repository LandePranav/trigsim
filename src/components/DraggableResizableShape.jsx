import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import Backcity from "../assets/Backcity";
import Cameraman from "../assets/Cameraman";
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import Target from "../assets/Target";
import ZoomControls from "./ZoomControls";
import * as THREE from 'three';
import VirtualCamera from "./VirtualCamera";
import CameraSvg from "../assets/CameraSvg";
import Visible from "../assets/Visible";
import NotVisible from "../assets/NotVisible";

const DraggableResizableShape = () => {
  const [cameramanPosition, setCameramanPosition] = useState({ x: 250, y: -100 });
  const [isDraggingCameraman, setIsDraggingCameraman] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: window.innerWidth - 500, y: -300 });
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [isDraggingAngle, setIsDraggingAngle] = useState(false);
  const [angle, setAngle] = useState(45);
  const [distanceBetween, setDistanceBetween] = useState(null);
  const [heightDiff, setHeightDiff] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const linesRef = useRef([]);
  const currentLineRef = useRef(null);
  const zoomInRef = useRef(null);
  const zoomOutRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reqAngle, setReqAngle] = useState(10);
  const canvasRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState({ minX: 100, maxX: innerWidth - 200 });
  const [isPanning, setIsPanning] = useState(false) ;
  const [isPanningHard, setIsPanningHard] = useState(false) ;
  const [panOffset, setPanOffset] = useState({x:0,y:0});
  const [lastPanPosition,setLastPanPosition] = useState({x:0,y:0}) ;

  useEffect(() => {
    const angleInRad = Math.atan2(heightDiff, distanceBetween);
    const angleInDeg = angleInRad * (180 / Math.PI);
    setReqAngle(angleInDeg);
  }, [angle, distanceBetween, heightDiff]);

  useEffect(() => {
    setDistanceBetween(Math.round(targetPosition.x - cameramanPosition.x));
    setHeightDiff(Math.round(targetPosition.y + 390));
  }, [cameramanPosition, targetPosition]);

  const lineStart = {
    x: cameramanPosition.x + 150 + 25,
    y: window.innerHeight - 45,
  };

  const lineEnd = {
    x: targetPosition.x,
    y: window.innerHeight - 45,
  };

  const vlineStart = {
    x: targetPosition.x,
    y: window.innerHeight - 150,
  };

  const vlineEnd = {
    x: targetPosition.x,
    y: window.innerHeight - targetPosition.y - 530,
  };

  const handleReset = () => {
    setCameramanPosition({ x: 250, y: -100 });
    setTargetPosition({ x: window.innerWidth - 300, y: -300 });
    setIsPanning(false) ;
    setPanOffset({x:0, y:0}) ;
    setLastPanPosition({x:0, y:0}) ;
  };

  const handleClickImage = () => {
    console.log("hello");
  };

  const handlePointerMove = useCallback((e) => {
    if (isDraggingCameraman) {
      setCameramanPosition((prev) => ({
        x: Math.max(maxWidth.minX, Math.min(maxWidth.maxX, prev.x + (e.movementX))),
      }));
    } else if (isDraggingTarget) {
      setTargetPosition((prev) => ({
        x: Math.max(maxWidth.minX, Math.min(maxWidth.maxX, prev.x + (e.movementX))),
        y: Math.max(-350, Math.min(0, prev.y - (e.movementY))),
      }));
    } else if (isDrawing && e.point) {
      const { x, y } = e.point;
      if (currentLineRef.current) {
        currentLineRef.current.geometry.vertices.push(new THREE.Vector3(x, y, 0));
        currentLineRef.current.geometry.verticesNeedUpdate = true;
      }
    } else if (isPanningHard){
      const dx = e.clientX - lastPanPosition.x ;
      const dy = e.clientY - lastPanPosition.y ;
      setPanOffset((prev) => ({x:prev.x +dx, y: prev.y + dy})) ;
      setLastPanPosition({x:e.clientX, y:e.clientY}) ;
    }
  }, [isDraggingCameraman, isDraggingTarget, isDrawing, isPanningHard, lastPanPosition, maxWidth]);

  const handlePointerDown = (e) => {

    if(isPanning){
      setIsPanningHard(() => true) ;
      setLastPanPosition({x:e.clientX, y:e.clientY}) ;
      // canvasRef.current.style.cursor = "holding" ;
    }

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

  const onAngleChange = (newAngle) => {
    setAngle(newAngle);
  };

  const handlePointerUp = () => {
    setIsDraggingCameraman(false);
    setIsDraggingTarget(false);
    currentLineRef.current = null;
    setIsDraggingAngle(false);
    setIsPanningHard(false) ;
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.width = `${window.innerWidth * zoomLevel}px`;
    }

    setMaxWidth({ minX: 100, maxX: innerWidth - 200 });

  }, [zoomLevel]);

  return (
    <div className={"w-screen h-screen relative"+(isPanning ? " cursor-grab":"") + (isPanningHard ? " cursor-grabbing " : "")}>
      <Navbar className="absolute z-50" isPanning={isPanning} setIsPanning={setIsPanning} isDrawing={isDrawing} setIsDrawing={setIsDrawing} handleReset={handleReset} zoomIn={zoomInRef} zoomOut={zoomOutRef} />

      <Canvas
        ref={canvasRef}
        className="w-full h-full"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        camera={{ zoom: zoomLevel, position: [0, 0, 5] }}
        style={{ zIndex: 10 }}
      >
        <ZoomControls setZoomLevel={setZoomLevel} zoomInRef={zoomInRef} zoomOutRef={zoomOutRef} />
        <OrbitControls
          onChange={(e) => {
            if (e && e.target) {
              setZoomLevel(e.target.object.zoom);
            }
          }}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Html fullscreen>
          <div className="w-screen h-screen overflow-y-hidden -z-10" style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)` }}>
            <div className="absolute w-1/2 flex justify-end top-12">
              <CameraSvg className="w-44 absolute -right-24" />
            </div>

            <div className="absolute w-1/2 flex justify-end top-36">
              <div className="absolute text-pretty w-60 -top-2 font-thin right-28 text-white bg-black bg-opacity-85 rounded-md p-2">
                {(reqAngle <= angle) ?
                  <p>
                    The target person is visible.
                    Current angle of inclination is more than required!
                  </p>
                  :
                  <p>
                    Target person is not visible yet.
                    Try to increase angle of inclination!
                  </p>}
              </div>

              <div className="absolute w-36 h-16 overflow-hidden -right-12">
                {(reqAngle <= angle) ?
                  <Visible
                    className="absolute w-full h-20 object-cover"
                  />
                  :
                  <NotVisible
                    className="absolute w-full h-40 -top-8 object-cover"
                  />
                }
              </div>
            </div>
            <div className="absolute inset-0 w-full h-full -z-10">
              <Backcity className="object-cover w-full h-full opacity-65 -z-10" />
            </div>

            <div className="absolute z-30" style={{ left: `${(lineEnd.x + lineStart.x) / 2 - 10}px`, bottom: "60px" }}>
              <h2 className="bg-gray-700 text-white px-2 rounded-md">{distanceBetween / 10}m</h2>
            </div>

            <div className="absolute z-30" style={{ left: `${vlineEnd.x - 65}px`, top: `${(vlineEnd.y + vlineStart.y) / 2 - 15}px` }}>
              <h2 className="bg-gray-700 text-white px-2 rounded-md">{heightDiff / 10}m</h2>
            </div>

            <svg className="absolute w-full h-full pointer-events-none opacity-50">
              <defs>
                <marker id="arrow-start" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse" markerUnits="strokeWidth">
                  <path d="M0,0 L10,5 L0,10 Z" fill="red" />
                </marker>
                <marker id="arrow-end" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L10,5 L0,10 Z" fill="red" />
                </marker>
              </defs>
              <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} stroke="red" strokeWidth="2" markerStart="url(#arrow-start)" markerEnd="url(#arrow-end)" />
            </svg>

            <svg className="absolute w-full h-full pointer-events-none opacity-50">
              <defs>
                <marker id="arrow-start" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse" markerUnits="strokeWidth">
                  <path d="M0,0 L10,5 L0,10 Z" fill="red" />
                </marker>
                <marker id="arrow-end" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L10,5 L0,10 Z" fill="red" />
                </marker>
              </defs>
              <line x1={vlineStart.x} y1={vlineStart.y} x2={vlineEnd.x} y2={vlineEnd.y} stroke="red" strokeWidth="2" markerStart="url(#arrow-start)" markerEnd="url(#arrow-end)" />
            </svg>

            <div
              className="absolute cursor-move"
              style={{
                left: `${cameramanPosition.x}px`,
                bottom: `${cameramanPosition.y}px`,
                height: "350px",
                width: "150px",
                zIndex: 10,
              }}
              onPointerDown={() => setIsDraggingCameraman(true)}
            >
              <Cameraman className="w-full h-full z-10" />
            </div>

            <div
              className="absolute cursor-move"
              style={{
                left: `${targetPosition.x}px`,
                bottom: `${targetPosition.y}px`,
                height: "550px",
                width: "200px",
                zIndex: 10,
              }}
              onPointerDown={() => setIsDraggingTarget(true)}
            >
              <Target className="w-full h-full z-10" />
            </div>
            <VirtualCamera cameramanPosition={cameramanPosition} onAngleChange={onAngleChange} handleClickImage={handleClickImage} />
          </div>
        </Html>

        {linesRef.current.map((line, index) => (
          <primitive key={index} object={line} />
        ))}
      </Canvas>
    </div>
  );
};

export default DraggableResizableShape;