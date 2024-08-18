import Navbar from './components/Navbar'
import Backcity from './assets/Backcity';
import Cameraman from './assets/Cameraman';
import DraggableResizableShape from './components/DraggableResizableShape';
import { useEffect, useRef } from 'react';
import { useTimeout } from '@mantine/hooks';
function App() {
  const hasAlerted = useRef(false) ;

  useEffect(()=> {
    if(!hasAlerted.current){
     
        window.alert("Trying moving the buildings and the angle") ;
    }
    hasAlerted.current = true ;
  }, []) ;

  return (
      <div>
        <DraggableResizableShape/>
      </div>
  )
}

export default App
