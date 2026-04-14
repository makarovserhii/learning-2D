import type { SimEntity } from '../engine/engine.types';

export function updateEntityMotion(
  entity: SimEntity,
  dt: number,
  multiplier: number,
  bounds: { width: number; height: number },
): void {
  if (entity.body.isDragging) {
    return;
  }

  const minX = 0;
  const maxX = bounds.width - entity.body.size;
  const minY = 0;
  const maxY = bounds.height - entity.body.size;

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
}
