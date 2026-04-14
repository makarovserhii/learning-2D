import { createEntity } from '../entities/createEntity';
import type { SceneRuntimeConfig, SimEntity } from '../engine/engine.types';
import {
  BALL_BODY_CONSTANTS,
  MULTIPLE_OBJECTS_SCENE_CONSTANTS,
  SQUARE_2_BODY_CONSTANTS,
  SQUARE_BODY_CONSTANTS,
} from '../shared/lib/constants/constants';

export type DraggableObjectsScene = {
  entities: SimEntity[];
  runtimeConfig: SceneRuntimeConfig;
};

export function createDraggableObjectsScene(): DraggableObjectsScene {
  const c = MULTIPLE_OBJECTS_SCENE_CONSTANTS;

  return {
    entities: [
      createEntity('ball-1', 'ball', BALL_BODY_CONSTANTS),
      createEntity('square-1', 'square', SQUARE_BODY_CONSTANTS),
      createEntity('square-2', 'square-2', SQUARE_2_BODY_CONSTANTS),
    ],
    runtimeConfig: {
      width: c.width,
      height: c.height,
      maxDt: c.MAX_DT,
      dragReleaseMultiplier: c.DRAG_RELEASE_MULTIPLIER,
      clickSpeedMin: c.CLICK_SPEED_MIN,
      clickSpeedMax: c.CLICK_SPEED_MAX,
    },
  };
}
