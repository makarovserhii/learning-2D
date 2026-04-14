import type { PointerState } from '../shared/lib/types/types';

import type { SimEntity } from '../engine/engine.types';

export function pickEntityAt(
  entities: SimEntity[],
  pointerX: number,
  pointerY: number,
): SimEntity | null {
  for (const entity of entities) {
    const { x, y } = entity.body.position;
    const size = entity.body.size;

    if (
      pointerX >= x &&
      pointerX <= x + size &&
      pointerY >= y &&
      pointerY <= y + size
    ) {
      return entity;
    }
  }

  return null;
}

export function scenePointFromClient(
  clientX: number,
  clientY: number,
  sceneRect: DOMRect,
): { x: number; y: number } {
  return {
    x: clientX - sceneRect.left,
    y: clientY - sceneRect.top,
  };
}

export function applyPointerDown(
  pointer: PointerState,
  entities: SimEntity[],
  sceneX: number,
  sceneY: number,
): void {
  pointer.isDown = true;

  pointer.lastDeltaX = 0;
  pointer.lastDeltaY = 0;

  pointer.x = sceneX;
  pointer.y = sceneY;
  pointer.previousX = sceneX;
  pointer.previousY = sceneY;

  const entity = pickEntityAt(entities, sceneX, sceneY);

  const previousGrabbedEntity = entities.find(
    (e) => e.id === pointer.grabbedEntityId,
  );

  if (previousGrabbedEntity) {
    previousGrabbedEntity.body.isDragging = false;
  }

  if (entity) {
    entity.body.isDragging = true;
    pointer.grabbedEntityId = entity.id;

    pointer.dragOffsetX = pointer.x - entity.body.position.x;
    pointer.dragOffsetY = pointer.y - entity.body.position.y;
  } else {
    pointer.grabbedEntityId = null;
    pointer.dragOffsetX = 0;
    pointer.dragOffsetY = 0;
  }
}

export function applyPointerMove(
  pointer: PointerState,
  entities: SimEntity[],
  sceneX: number,
  sceneY: number,
): void {
  pointer.previousX = pointer.x;
  pointer.previousY = pointer.y;

  pointer.x = sceneX;
  pointer.y = sceneY;

  const deltaX = pointer.x - pointer.previousX;
  const deltaY = pointer.y - pointer.previousY;

  const hasMeaningfulMovement =
    Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;

  if (hasMeaningfulMovement) {
    pointer.lastDeltaX = deltaX;
    pointer.lastDeltaY = deltaY;
  }

  if (!pointer.isDown) return;
  if (!pointer.grabbedEntityId) return;

  const grabbedEntity = entities.find(
    (entity) => entity.id === pointer.grabbedEntityId,
  );

  if (!grabbedEntity) return;

  grabbedEntity.body.position.x = pointer.x - pointer.dragOffsetX;
  grabbedEntity.body.position.y = pointer.y - pointer.dragOffsetY;
}

export function applyPointerUp(
  pointer: PointerState,
  entities: SimEntity[],
  dragReleaseMultiplier: number,
): void {
  pointer.isDown = false;

  const grabbedEntityId = pointer.grabbedEntityId;

  if (grabbedEntityId) {
    const grabbedEntity = entities.find(
      (entity) => entity.id === grabbedEntityId,
    );

    if (grabbedEntity) {
      grabbedEntity.body.isDragging = false;

      grabbedEntity.body.velocity.x =
        pointer.lastDeltaX * dragReleaseMultiplier;
      grabbedEntity.body.velocity.y =
        pointer.lastDeltaY * dragReleaseMultiplier;
    }
  }

  pointer.grabbedEntityId = null;
  pointer.dragOffsetX = 0;
  pointer.dragOffsetY = 0;
}
