import './App.css';
import { BallAnimation } from './components/BallAnimation/BallAnimation';
import { MultipleObjectsAnimation } from './components/MultipleObjectsAnimation/MultipleObjectsAnimation';
import { DraggableObjects } from './components/DraggableObjects/DraggableObjects';

function App() {
  return (
    <div className='page'>
      <BallAnimation />
      <MultipleObjectsAnimation />
      <DraggableObjects />
    </div>
  );
}

export default App;
