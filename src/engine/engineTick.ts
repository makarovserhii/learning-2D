import {
  runCollisionSystem,
  sampleFps,
  updateEntityMotion,
} from '../systems';

import type { EngineState, EngineTickOptions, SceneRuntimeConfig } from './engine.types';

export function engineTick(
  state: EngineState,
  config: SceneRuntimeConfig,
  now: number,
  options?: EngineTickOptions,
): void {
  if (state.lastTime === 0) {
    state.lastTime = now;
  }

  const rawDt = (now - state.lastTime) / 1000;
  state.lastTime = now;

  const dt = Math.min(rawDt, config.maxDt);
  const multiplier = options?.slowMode ? 0.35 : 1;

  const bounds = { width: config.width, height: config.height };

  for (const entity of state.entities) {
    updateEntityMotion(entity, dt, multiplier, bounds);
  }

  runCollisionSystem(state.entities, state.intersectingPairs);

  sampleFps(state, now, options?.onFpsSample);
}
