
import { useThree } from "@react-three/fiber";


export default function ZoomControls({zoomInRef, zoomOutRef}) {
    const { camera } = useThree();

    zoomInRef.current = () => {
        camera.zoom = Math.min(camera.zoom + 0.2, 3); // Max zoom level
        camera.updateProjectionMatrix(); // Update the projection matrix after changing zoom
    }

    zoomOutRef.current = () => {
        camera.zoom = Math.max(camera.zoom - 0.2, 0.5); // Min zoom level
        camera.updateProjectionMatrix();
    }

}
