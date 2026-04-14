import './App.css';
import { BallAnimation } from './components/BallAnimation/BallAnimation';
import { BallAndSquareAnimation } from './components/BallAndSquareAnimation/BallAndSquareAnimation';

function App() {
  return (
    <div className='page'>
      <BallAnimation />
      <BallAndSquareAnimation />
    </div>
  );
}

export default App;
