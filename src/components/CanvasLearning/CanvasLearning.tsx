import { useEffect, useRef } from 'react';
import './CanvasLearning.css';

export const CanvasLearning = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = 'tomato';
    context.fillRect(100, 100, 80, 80);
  }, []);

  return (
    <div className='canvas-learning'>
      <canvas ref={canvasRef} width={800} height={500} />
    </div>
  );
};
