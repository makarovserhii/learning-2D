import { useCallback, useEffect, useRef, useState } from 'react';
import { getRandomVelocity } from '../../shared/lib/utils';
import type { Vector2 } from '../../shared/lib/types/types';

import type { SceneEntity } from '../../shared/lib/types/types';

import _ from 'lodash';

import {
  MULTIPLE_OBJECTS_SCENE_CONSTANTS,
  BALL_BODY_CONSTANTS,
  SQUARE_BODY_CONSTANTS,
} from '../../shared/lib/constants/constants';

import './MultipleObjectsAnimation.css';

function getPairKey(aId: string, bId: string) {
  return aId < bId ? `${aId}|${bId}` : `${bId}|${aId}`;
}

export function MultipleObjectsAnimation() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const ballRef = useRef<HTMLDivElement | null>(null);
  const squareRef = useRef<HTMLDivElement | null>(null);

  const backgroundOrbRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  const isSlowModeRef = useRef<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const fpsFramesRef = useRef<number>(0);
  const fpsLastSampleTimeRef = useRef<number>(0);

  const intersectingPairsRef = useRef<Map<string, boolean>>(new Map());

  const [debug, setDebug] = useState({
    fps: 0,
    slowMode: false,
  });

  const entitiesRef = useRef<SceneEntity[]>([
    {
      id: 'ball',
      kind: 'ball',
      elementRef: ballRef,
      body: _.cloneDeep(BALL_BODY_CONSTANTS),
    },
    {
      id: 'square',
      kind: 'square',
      elementRef: squareRef,
      body: _.cloneDeep(SQUARE_BODY_CONSTANTS),
    },
  ]);

  const handleCtaClick = () => {
    for (const entity of entitiesRef.current) {
      if (!entity.body) continue;

      entity.body.velocity = getRandomVelocity(
        MULTIPLE_OBJECTS_SCENE_CONSTANTS.CLICK_SPEED_MIN,
        MULTIPLE_OBJECTS_SCENE_CONSTANTS.CLICK_SPEED_MAX,
      );
    }

    console.log({
      event: 'cta_click',
      timestamp: Date.now(),
    });
  };

  const renderEntity = useCallback(
    (element: HTMLDivElement | null, position: Vector2) => {
      if (!element) return;

      element.style.transform = `translate(${position.x}px, ${position.y}px)`;
    },
    [],
  );

  const updateFps = useCallback((now: number) => {
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
  }, []);

  const updateEntity = useCallback(
    (entity: SceneEntity, dt: number, multiplier: number) => {
      if (entity.body.isDragging) {
        return;
      }

      const minX = 0;
      const maxX = MULTIPLE_OBJECTS_SCENE_CONSTANTS.width - entity.body.size;
      const minY = 0;
      const maxY = MULTIPLE_OBJECTS_SCENE_CONSTANTS.height - entity.body.size;

      const entityPosition = entity.body.position;
      const entityVelocity = entity.body.velocity;

      entity.body.previousPosition = { ...entity.body.position };

      entityPosition.x += entityVelocity.x * dt * multiplier;
      entityPosition.y += entityVelocity.y * dt * multiplier;

      if (entityPosition.x >= maxX) {
        entityPosition.x = maxX;
        entityVelocity.x = -Math.abs(entityVelocity.x);
      }

      if (entityPosition.x <= minX) {
        entityPosition.x = minX;
        entityVelocity.x = Math.abs(entityVelocity.x);
      }

      if (entityPosition.y >= maxY) {
        entityPosition.y = maxY;
        entityVelocity.y = -Math.abs(entityVelocity.y);
      }

      if (entityPosition.y <= minY) {
        entityPosition.y = minY;
        entityVelocity.y = Math.abs(entityVelocity.y);
      }
    },
    [],
  );

  const updateDebug = useCallback(() => {
    setDebug((prev) => ({
      ...prev,
      slowMode: isSlowModeRef.current,
    }));
  }, []);

  const isIntersecting = useCallback(
    (a: SceneEntity, b: SceneEntity): boolean => {
      return (
        a.body.position.x + a.body.size > b.body.position.x &&
        a.body.position.x < b.body.position.x + b.body.size &&
        a.body.position.y + a.body.size > b.body.position.y &&
        a.body.position.y < b.body.position.y + b.body.size
      );
    },
    [],
  );

  const reactOnIntersecting = useCallback(
    (entityA: SceneEntity, entityB: SceneEntity) => {
      const isIntersectingNow = isIntersecting(entityA, entityB);
      const pairKey = getPairKey(entityA.id, entityB.id);

      if (isIntersectingNow && !intersectingPairsRef.current.get(pairKey)) {
        intersectingPairsRef.current.set(pairKey, true);
        const oldVxA = entityA.body.velocity.x;
        const oldVyA = entityA.body.velocity.y;
        const oldVxB = entityB.body.velocity.x;
        const oldVyB = entityB.body.velocity.y;

        const aLeft = entityA.body.position.x;
        const aRight = entityA.body.position.x + entityA.body.size;
        const bLeft = entityB.body.position.x;
        const bRight = entityB.body.position.x + entityB.body.size;

        const aTop = entityA.body.position.y;
        const aBottom = entityA.body.position.y + entityA.body.size;
        const bTop = entityB.body.position.y;
        const bBottom = entityB.body.position.y + entityB.body.size;

        const overlapX = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
        const overlapY = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);

        const isALeftOfB = aLeft < bLeft;
        const isATopOfB = aTop < bTop;

        if (overlapX < overlapY) {
          entityA.body.velocity.x = oldVxB;
          entityB.body.velocity.x = oldVxA;

          if (isALeftOfB) {
            entityA.body.position.x -= overlapX / 2;
            entityB.body.position.x += overlapX / 2;
          } else {
            entityA.body.position.x += overlapX / 2;
            entityB.body.position.x -= overlapX / 2;
          }
        } else {
          entityA.body.velocity.y = oldVyB;
          entityB.body.velocity.y = oldVyA;

          if (isATopOfB) {
            entityA.body.position.y -= overlapY / 2;
            entityB.body.position.y += overlapY / 2;
          } else {
            entityA.body.position.y += overlapY / 2;
            entityB.body.position.y -= overlapY / 2;
          }
        }
      }

      if (!isIntersectingNow) {
        intersectingPairsRef.current.delete(pairKey);
      }
    },
    [isIntersecting],
  );

  useEffect(() => {
    const tick = (now: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = now;
      }

      const rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const dt = Math.min(rawDt, MULTIPLE_OBJECTS_SCENE_CONSTANTS.MAX_DT);
      const multiplier = isSlowModeRef.current ? 0.35 : 1;

      // Update ALL entities (velocity and position) + save previous values
      for (const item of entitiesRef.current) {
        updateEntity(item, dt, multiplier);
      }

      // React on intersecting entities
      for (let i = 0; i < entitiesRef.current.length; i++) {
        const currentEntity = entitiesRef.current[i];

        for (let j = i + 1; j < entitiesRef.current.length; j++) {
          reactOnIntersecting(currentEntity, entitiesRef.current[j]);
        }
      }

      // Render ALL entities
      for (const item of entitiesRef.current) {
        renderEntity(item.elementRef.current, item.body.position);
      }

      // LOG FPS & DEBUG
      updateFps(now);
      updateDebug();

      // Request next frame
      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [updateEntity, renderEntity, updateDebug, reactOnIntersecting, updateFps]);

  return (
    <div className='scene' ref={sceneRef}>
      <div className='background-orb' ref={backgroundOrbRef} />

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
        <h1 className='headline'>Multiple Objects Animation</h1>
        <p className='lead'>
          One loop, physics-based interactions, deltaTime, bounce, hover
          slowdown and click reaction for multiple objects.
        </p>
      </div>

      <div
        className='ball'
        ref={(element) => {
          ballRef.current = element;
          entitiesRef.current[0].elementRef.current = element;
        }}
        style={{
          width: MULTIPLE_OBJECTS_SCENE_CONSTANTS.BALL_SIZE,
          height: MULTIPLE_OBJECTS_SCENE_CONSTANTS.BALL_SIZE,
        }}
      />
      <div
        className='square'
        ref={(element) => {
          if (element) {
            squareRef.current = element;
            entitiesRef.current[1].elementRef.current = element;
          }
        }}
        style={{
          width: MULTIPLE_OBJECTS_SCENE_CONSTANTS.SQUARE_SIZE,
          height: MULTIPLE_OBJECTS_SCENE_CONSTANTS.SQUARE_SIZE,
        }}
      />

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
