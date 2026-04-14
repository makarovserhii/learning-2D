import type { PointerState } from '../shared/lib/types/types';

import type { EngineState, SimEntity } from './engine.types';

function createInitialPointerState(): PointerState {
  return {
    x: 0,
    y: 0,
    previousX: 0,
    previousY: 0,
    isDown: false,
    grabbedEntityId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastDeltaX: 0,
    lastDeltaY: 0,
  };
}

export function createEngineState(entities: SimEntity[]): EngineState {
  return {
    entities,
    pointer: createInitialPointerState(),
    intersectingPairs: new Map(),
    lastTime: 0,
    fpsFrames: 0,
    fpsLastSampleTime: 0,
  };
}
