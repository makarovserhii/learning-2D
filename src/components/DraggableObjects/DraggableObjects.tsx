import { useEffect, useMemo, useRef, useState } from 'react';

import { Engine } from '../../engine';
import { createDraggableObjectsScene } from '../../scene/createScene';
import {
  applyPointerDown,
  applyPointerMove,
  applyPointerUp,
  randomizeAllVelocities,
  renderEntityDom,
} from '../../systems';

import { MULTIPLE_OBJECTS_SCENE_CONSTANTS } from '../../shared/lib/constants/constants';

import './DraggableObjects.css';

function bindElement(
  elementById: Record<string, HTMLDivElement | null>,
  id: string,
  element: HTMLDivElement | null,
): void {
  elementById[id] = element;
}

export function DraggableObjects() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const elementByIdRef = useRef<Record<string, HTMLDivElement | null>>({});
  const isSlowModeRef = useRef(false);

  const engine = useMemo(() => {
    const { entities, runtimeConfig } = createDraggableObjectsScene();
    return new Engine(entities, runtimeConfig);
  }, []);

  const animationFrameIdRef = useRef<number | null>(null);

  const [debug, setDebug] = useState({
    fps: 0,
    slowMode: false,
  });

  const handleCtaClick = () => {
    randomizeAllVelocities(
      engine.state.entities,
      engine.config.clickSpeedMin,
      engine.config.clickSpeedMax,
    );

    console.log({
      event: 'cta_click',
      timestamp: Date.now(),
    });
  };

  useEffect(() => {
    const tick = (now: number) => {
      engine.tick(now, {
        slowMode: isSlowModeRef.current,
        onFpsSample: (fps) => setDebug((prev) => ({ ...prev, fps })),
      });

      setDebug((prev) => ({
        ...prev,
        slowMode: isSlowModeRef.current,
      }));

      for (const entity of engine.state.entities) {
        renderEntityDom(
          elementByIdRef.current[entity.id] ?? null,
          entity.body.position,
        );
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [engine]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const sceneRect = sceneRef.current?.getBoundingClientRect();

      if (!sceneRect) return;

      applyPointerDown(
        engine.state.pointer,
        engine.state.entities,
        event.clientX - sceneRect.left,
        event.clientY - sceneRect.top,
      );
    };

    const onMouseMove = (event: MouseEvent) => {
      const sceneRect = sceneRef.current?.getBoundingClientRect();

      if (!sceneRect) return;

      applyPointerMove(
        engine.state.pointer,
        engine.state.entities,
        event.clientX - sceneRect.left,
        event.clientY - sceneRect.top,
      );
    };

    const onMouseUp = () => {
      applyPointerUp(
        engine.state.pointer,
        engine.state.entities,
        engine.config.dragReleaseMultiplier,
      );
    };

    const node = sceneRef.current;
    node?.addEventListener('mousedown', onMouseDown);
    node?.addEventListener('mousemove', onMouseMove);
    node?.addEventListener('mouseup', onMouseUp);

    return () => {
      node?.removeEventListener('mousedown', onMouseDown);
      node?.removeEventListener('mousemove', onMouseMove);
      node?.removeEventListener('mouseup', onMouseUp);
    };
  }, [engine]);

  const c = MULTIPLE_OBJECTS_SCENE_CONSTANTS;

  return (
    <div className='scene' ref={sceneRef}>
      <div className='background-orb' />

      <div
        className='debug-panel'
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div>fps: {debug.fps}</div>
        <div>slow: {debug.slowMode ? 'on' : 'off'}</div>
      </div>

      <div
        className='headline-block'
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <h1 className='headline'>Draggable Objects</h1>
        <p className='lead'>
          One loop, physics-based interactions, deltaTime, bounce, hover
          slowdown and click reaction for multiple draggable objects.
        </p>
      </div>

      <div
        className='ball'
        ref={(element) => {
          bindElement(elementByIdRef.current, 'ball-1', element);
        }}
        style={{
          width: c.BALL_SIZE,
          height: c.BALL_SIZE,
        }}
      />
      <div
        className='square'
        ref={(element) => {
          bindElement(elementByIdRef.current, 'square-1', element);
        }}
        style={{
          width: c.SQUARE_SIZE,
          height: c.SQUARE_SIZE,
        }}
      />

      <div
        className='square-2'
        ref={(element) => {
          bindElement(elementByIdRef.current, 'square-2', element);
        }}
        style={{
          width: c.SQUARE_2_SIZE,
          height: c.SQUARE_2_SIZE,
        }}
      />

      <button
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
