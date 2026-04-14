export const MULTIPLE_OBJECTS_SCENE_CONSTANTS = {
  width: 800,
  height: 400,

  BALL_SIZE: 100,
  SQUARE_SIZE: 90,
  SQUARE_2_SIZE: 100,

  CLICK_SPEED_MIN: 320,
  CLICK_SPEED_MAX: 460,

  MAX_DT: 0.05,
  DRAG_RELEASE_MULTIPLIER: 16,
};

export const BALL_BODY_CONSTANTS = {
  position: { x: 500, y: 80 },
  previousPosition: { x: 500, y: 80 },
  velocity: { x: 400, y: 300 },
  previousVelocity: { x: 400, y: 300 },
  size: MULTIPLE_OBJECTS_SCENE_CONSTANTS.BALL_SIZE,
  isDragging: false,
};

export const SQUARE_BODY_CONSTANTS = {
  position: { x: 200, y: 80 },
  previousPosition: { x: 200, y: 80 },
  velocity: { x: 300, y: 200 },
  previousVelocity: { x: 300, y: 200 },
  size: MULTIPLE_OBJECTS_SCENE_CONSTANTS.SQUARE_SIZE,
  isDragging: false,
};

export const SQUARE_2_BODY_CONSTANTS = {
  position: { x: 300, y: 80 },
  previousPosition: { x: 300, y: 80 },
  velocity: { x: 300, y: 200 },
  previousVelocity: { x: 300, y: 200 },
  size: MULTIPLE_OBJECTS_SCENE_CONSTANTS.SQUARE_2_SIZE,
  isDragging: false,
};
