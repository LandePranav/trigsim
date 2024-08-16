import {Canvas, useThree} from "@react-three/fiber" ;
import {Html} from "@react-three/drei" ;
import Backcity from "../assets/Backcity" ;
import Cameraman from "../assets/Cameraman" ;
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import Target from "../assets/Target" ;
import ZoomControls from "./ZoomControls";

export default function DraggableResizableShape() {
    const [CameramanPosition, setCamermanPosition] = useState({x:50, y:-100}) ;
    // const [CameramanHeight, setCameramanHeight] = useState(300) ;
    const [isDraggingCameraman, setIsDraggingCameraman] = useState(false) ;

    const [targetPosition, setTargetPosition] = useState({x:window.innerWidth - 200, y:-300});
    const [isDraggingTarget, setIsDraggingTarget] = useState(false) ;
    const [distanceBetween, setDistanceBetween] = useState(null) ;
    const [heightDiff, setHeightDiff] = useState(null) ;

    const zoomInRef = useRef(null);
    const zoomOutRef = useRef(null);

    useEffect(() => {
        setDistanceBetween(Math.round(targetPosition.x - CameramanPosition.x)) ;
        setHeightDiff(Math.round(targetPosition.y + 500)) ;
    }, [CameramanPosition, targetPosition]) ;

    // const handlePointerDownDrag = (e) => {
    //     setIsDragging(true) ;
    //     e.stopPropagation() ;
    // }

    // const handlePointerDownResize = (e) => {
    //     setIsResizing(true) ;
    //     e.stopPropagation();
    // }
    const handleReset = () => {
        setCamermanPosition({x:50, y:-100});
        setTargetPosition({x:window.innerWidth - 200, y:-300});
    }

    const handlePointerMove = (e) => {
        if(isDraggingCameraman){
            setCamermanPosition((prev) => ({
                x:e.clientX-50, 
                //y:Math.min(0, Math.max(e.clientY - window.innerHeight, -300)),
            })) ;
        } else if (isDraggingTarget){
            // const newHeight = Math.max(200, height + (position.y - e.clientY));
            // const newY = Math.min(position.y + height - 150, e.clientY) ;
            // setHeight(newHeight) ;
            // setPosition((prev) => ({...prev, y:newY})) ;
            setTargetPosition((prev) => ({
                x: e.clientX -50,
                y: Math.max(-300, Math.min(0, prev.y - (e.movementY))) ,
            })) ;
        }
    };

    const handlePointerUp = () => {
        setIsDraggingCameraman(false);
        setIsDraggingTarget(false);
    }

    return(
        <div className="w-screen h-screen">
            

            <Canvas className="w-screen h-screen " onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>

                <ZoomControls zoomInRef={zoomInRef} zoomOutRef={zoomOutRef} />
                <Html fullscreen>
                <Navbar handleReset={handleReset} zoomIn={zoomInRef} zoomOut={zoomOutRef} />
                    <div className="absolute inset-0 w-full h-full -z-10">
                        <Backcity className="object-cover w-full h-full opacity-65"/>
                    </div>

                    <div 
                        className="absolute cursor-move"
                        style={{
                                    left: `${CameramanPosition.x}px`,
                                    bottom: `${CameramanPosition.y}px`,
                                    height: "200px",
                                    width : "150px",
                                    zIndex: 10,
                                }}
                        onPointerDown={() => setIsDraggingCameraman(true)}       
                    >
                            <Cameraman className="w-full h-full z-10 " 
                        /> 
                    </div>

                    {/* <div 
                        className="absolute cursor-ns-resize bg-blue-500"
                        style={{
                            left: `${position.x +(height/3)/2 -20}px`,
                            top: `${position.y + 50}px`,
                            width: "40px",
                            height: "5px",
                            zIndex:20
                        }}        
                        onPointerDown={handlePointerDownResize}
                    /> */}

                    <div>
                        Dist :- {distanceBetween}---
                        Height :- {heightDiff}
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
                        onPointerDown={()=> setIsDraggingTarget(true)}
                    >
                            <Target className="w-full h-full z-10" />   
                    </div>

                </Html>
                </Canvas>
        </div>
    );
}