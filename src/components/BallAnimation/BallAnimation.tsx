import { useEffect, useRef, useState } from 'react';
import './BallAnimation.css';

type Vector2 = {
  x: number;
  y: number;
};

const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 400;

const BALL_SIZE = 100;

const BASE_SPEED_MIN = 220;
const BASE_SPEED_MAX = 340;
const CLICK_SPEED_MIN = 320;
const CLICK_SPEED_MAX = 460;

const MAX_DT = 0.05;

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getRandomVelocity(minSpeed: number, maxSpeed: number): Vector2 {
  const angle = Math.random() * Math.PI * 2;
  const speed = randomInRange(minSpeed, maxSpeed);

  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
}

export function BallAnimation() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const backgroundOrbRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const isSlowModeRef = useRef<boolean>(false);

  const ballPositionRef = useRef<Vector2>({ x: 120, y: 80 });
  const ballVelocityRef = useRef<Vector2>(
    getRandomVelocity(BASE_SPEED_MIN, BASE_SPEED_MAX),
  );

  const bgOffsetRef = useRef<number>(0);
  const ctaPulseTimeRef = useRef<number>(0);

  const fpsFramesRef = useRef<number>(0);
  const fpsLastSampleTimeRef = useRef<number>(0);

  const [debug, setDebug] = useState({
    x: 120,
    y: 80,
    vx: 0,
    vy: 0,
    fps: 0,
    slowMode: false,
  });

  useEffect(() => {
    const ballEl = ballRef.current;
    const bgOrbEl = backgroundOrbRef.current;
    const ctaEl = ctaRef.current;

    if (!ballEl || !bgOrbEl || !ctaEl) {
      return;
    }

    const minX = 0;
    const maxX = SCENE_WIDTH - BALL_SIZE;
    const minY = 0;
    const maxY = SCENE_HEIGHT - BALL_SIZE;

    const updateFps = (now: number) => {
      fpsFramesRef.current += 1;

      if (fpsLastSampleTimeRef.current === 0) {
        fpsLastSampleTimeRef.current = now;
        return;
      }

      const elapsed = now - fpsLastSampleTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((fpsFramesRef.current * 1000) / elapsed);

        setDebug((prev) => ({
          ...prev,
          fps,
        }));

        fpsFramesRef.current = 0;
        fpsLastSampleTimeRef.current = now;
      }
    };

    const update = (now: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = now;
      }

      const rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const dt = Math.min(rawDt, MAX_DT);
      const multiplier = isSlowModeRef.current ? 0.35 : 1;

      const ballPosition = ballPositionRef.current;
      const ballVelocity = ballVelocityRef.current;

      ballPosition.x += ballVelocity.x * dt * multiplier;
      ballPosition.y += ballVelocity.y * dt * multiplier;

      if (ballPosition.x >= maxX) {
        ballPosition.x = maxX;
        ballVelocity.x = -Math.abs(ballVelocity.x);
      } else if (ballPosition.x <= minX) {
        ballPosition.x = minX;
        ballVelocity.x = Math.abs(ballVelocity.x);
      }

      if (ballPosition.y >= maxY) {
        ballPosition.y = maxY;
        ballVelocity.y = -Math.abs(ballVelocity.y);
      } else if (ballPosition.y <= minY) {
        ballPosition.y = minY;
        ballVelocity.y = Math.abs(ballVelocity.y);
      }

      bgOffsetRef.current += dt * multiplier;
      ctaPulseTimeRef.current += dt;
    };

    const render = () => {
      const ball = ballPositionRef.current;
      const bgOffset = bgOffsetRef.current;
      const ctaTime = ctaPulseTimeRef.current;

      const bgX = 40 + Math.sin(bgOffset) * 30;
      const bgY = 40 + Math.cos(bgOffset * 0.8) * 20;
      const ctaScale = 1 + Math.sin(ctaTime * 3.2) * 0.04;

      ballEl.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
      bgOrbEl.style.transform = `translate(${bgX}px, ${bgY}px) scale(1)`;
      ctaEl.style.transform = `scale(${ctaScale})`;
    };

    const tick = (now: number) => {
      const ballPosition = ballPositionRef.current;
      const ballVelocity = ballVelocityRef.current;

      updateFps(now);
      update(now);

      setDebug((prev) => ({
        ...prev,
        x: Number(ballPosition.x.toFixed(1)),
        y: Number(ballPosition.y.toFixed(1)),
        vx: Number(ballVelocity.x.toFixed(1)),
        vy: Number(ballVelocity.y.toFixed(1)),
        slowMode: isSlowModeRef.current,
      }));

      render();
      requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const handleCtaClick = () => {
    ballVelocityRef.current = getRandomVelocity(
      CLICK_SPEED_MIN,
      CLICK_SPEED_MAX,
    );

    console.log({
      event: 'cta_click',
      timestamp: Date.now(),
    });
  };

  return (
    <div className='scene' ref={sceneRef}>
      <div className='background-orb' ref={backgroundOrbRef} />

      <div className='debug-panel'>
        <div>x: {debug.x}</div>
        <div>y: {debug.y}</div>
        <div>vx: {debug.vx}</div>
        <div>vy: {debug.vy}</div>
        <div>fps: {debug.fps}</div>
        <div>slow: {debug.slowMode ? 'on' : 'off'}</div>
      </div>

      <div className='headline-block'>
        <h1 className='headline'>Single Object Animation</h1>
        <p className='lead'>
          One loop, deltaTime, bounce, hover slowdown and click reaction.
        </p>
      </div>

      <div className='ball' ref={ballRef} />

      <button
        ref={ctaRef}
        className='cta'
        onMouseEnter={() => {
          isSlowModeRef.current = true;
        }}
        onMouseLeave={() => {
          isSlowModeRef.current = false;
        }}
        onClick={handleCtaClick}
      >
        CTA
      </button>
    </div>
  );
}
