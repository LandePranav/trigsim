import { useThree, useFrame } from "@react-three/fiber";

export default function ZoomControls({ zoomInRef, zoomOutRef, setZoomLevel }) {
  const { camera } = useThree();

  zoomInRef.current = () => {
    camera.zoom = Math.min(camera.zoom + 0.2, 3); // Max zoom level
    setZoomLevel(camera.zoom);
    camera.updateProjectionMatrix(); // Update the projection matrix after changing zoom
    console.log('Zooming in');
    console.log('Zoom level:', camera.zoom);
  };

  zoomOutRef.current = () => {
    camera.zoom = Math.max(camera.zoom - 0.2, 0.5); // Min zoom level
    setZoomLevel(camera.zoom);
    camera.updateProjectionMatrix();
    console.log('Zooming out');
    console.log('Zoom level:', camera.zoom);
  };

  useFrame(() => {
    camera.updateProjectionMatrix();
  });

  return null;
}