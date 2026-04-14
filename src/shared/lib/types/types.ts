import type { RefObject } from 'react';

export type Vector2 = {
  x: number;
  y: number;
};

export type EntityBody = {
  position: Vector2;
  previousPosition: Vector2;
  velocity: Vector2;
  previousVelocity: Vector2;
  size: number;
  isDragging: boolean;
};

export type EntityType = 'ball' | 'square' | 'square-2';

export type SceneEntity = {
  id: string;
  kind: EntityType;
  elementRef: RefObject<HTMLDivElement | null>;
  body: EntityBody;
};

export type PointerState = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  isDown: boolean;
  grabbedEntityId: string | null;
  dragOffsetX: number;
  dragOffsetY: number;
  lastDeltaX: number;
  lastDeltaY: number;
};
