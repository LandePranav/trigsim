import {Canvas} from "@react-three/fiber" ;
import {Html} from "@react-three/drei" ;
import Backcity from "../assets/Backcity" ;
import Cameraman from "../assets/Cameraman" ;
import { useState } from "react";
import Navbar from "./Navbar";
import Target from "../assets/Target" ;

export default function DraggableResizableShape() {
    const [position, setPosition] = useState({x:50, y:window.innerWidth/5 +200}) ;
    const [height, setHeight] = useState(300) ;
    const [isDragging, setIsDragging] = useState(false) ;
    const [isResizing, setIsResizing] = useState(false) ;

    const handlePointerDownDrag = (e) => {
        setIsDragging(true) ;
        e.stopPropagation() ;
    }

    const handlePointerDownResize = (e) => {
        setIsResizing(true) ;
        e.stopPropagation();
    }

    const handlePointerMove = (e) => {
        if(isDragging){
            setPosition({x:e.clientX-50, y:e.clientY-height/2}) ;
        } else if (isResizing){
            const newHeight = Math.max(200, height + (position.y - e.clientY));
            const newY = Math.min(position.y + height - 150, e.clientY) ;
            setHeight(newHeight) ;
            setPosition((prev) => ({...prev, y:newY})) ;
        }
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    }

    return(
        <div className="w-screen h-screen">
            <Canvas className="w-screen h-screen" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
                <Html fullscreen>
                    <Navbar />
                    <div>
                        <Backcity className="absolute top-0 left-0 object-cover w-full h-full -z-10 opacity-65"/>
                    </div>
                    <div 
                        className="absolute cursor-move"
                        style={{
                                    left: `${position.x}px`,
                                    top: `${position.y}px`,
                                    height: `${height}px`,
                                    width : `${height/3}px`,
                                }}
                        onPointerDown={handlePointerDownDrag}       
                    >
                            <Cameraman className="w-full h-full z-10 absolute bottom-0" 
                        /> 
                    </div>
                    <div 
                        className="absolute cursor-ns-resize bg-blue-500"
                        style={{
                            left: `${position.x +(height/3)/2 -20}px`,
                            top: `${position.y + 50}px`,
                            width: "40px",
                            height: "5px",
                            zIndex:20
                        }}        
                        onPointerDown={handlePointerDownResize}
                    />
                    <div className="w-full h-full ">
                        <div className="absolute w-1/6 h-full bottom-0 right-0">
                            <Target className="w-full h-full z-10" />
                        </div>
                    </div>
                </Html>
            </Canvas>
        </div>
    );
}