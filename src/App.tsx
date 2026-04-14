import './App.css';
import { BallAnimation } from './components/BallAnimation/BallAnimation';
import { MultipleObjectsAnimation } from './components/MultipleObjectsAnimation/MultipleObjectsAnimation';
import { DraggableObjects } from './components/DraggableObjects/DraggableObjects';
import { CanvasLearning } from './components/CanvasLearning/CanvasLearning';

function App() {
  return (
    <div className='page'>
      <BallAnimation />
      <MultipleObjectsAnimation />
      <DraggableObjects />
      <CanvasLearning />
    </div>
  );
}

export default App;
