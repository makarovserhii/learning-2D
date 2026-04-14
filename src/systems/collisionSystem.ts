import type { SimEntity } from '../engine/engine.types';

function getPairKey(aId: string, bId: string): string {
  return aId < bId ? `${aId}|${bId}` : `${bId}|${aId}`;
}

function isIntersecting(a: SimEntity, b: SimEntity): boolean {
  return (
    a.body.position.x + a.body.size > b.body.position.x &&
    a.body.position.x < b.body.position.x + b.body.size &&
    a.body.position.y + a.body.size > b.body.position.y &&
    a.body.position.y < b.body.position.y + b.body.size
  );
}

function calculateObjectPairParameters(entityA: SimEntity, entityB: SimEntity) {
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

  return {
    oldVxA,
    oldVyA,
    oldVxB,
    oldVyB,
    overlapX,
    overlapY,
    isALeftOfB,
    isATopOfB,
  };
}

function resolveKinematicCollision(entityA: SimEntity, entityB: SimEntity): void {
  const {
    oldVxA,
    oldVyA,
    oldVxB,
    oldVyB,
    overlapX,
    overlapY,
    isALeftOfB,
    isATopOfB,
  } = calculateObjectPairParameters(entityA, entityB);

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

function resolveDraggingCollision(entityA: SimEntity, entityB: SimEntity): void {
  const { overlapX, overlapY, isALeftOfB, isATopOfB } =
    calculateObjectPairParameters(entityA, entityB);

  const isADragging = entityA.body.isDragging;
  const isBDragging = entityB.body.isDragging;

  if (isADragging && isBDragging) return;

  if (isADragging) {
    if (overlapX < overlapY) {
      entityB.body.velocity.x *= -1;

      if (isALeftOfB) {
        entityB.body.position.x += overlapX;
      } else {
        entityB.body.position.x -= overlapX;
      }
    } else {
      entityB.body.velocity.y *= -1;

      if (isATopOfB) {
        entityB.body.position.y += overlapY;
      } else {
        entityB.body.position.y -= overlapY;
      }
    }
  } else if (isBDragging) {
    if (overlapX < overlapY) {
      entityA.body.velocity.x *= -1;

      if (isALeftOfB) {
        entityA.body.position.x -= overlapX;
      } else {
        entityA.body.position.x += overlapX;
      }
    } else {
      entityA.body.velocity.y *= -1;

      if (isATopOfB) {
        entityA.body.position.y -= overlapY;
      } else {
        entityA.body.position.y += overlapY;
      }
    }
  }
}

function reactOnIntersecting(
  entityA: SimEntity,
  entityB: SimEntity,
  intersectingPairs: Map<string, boolean>,
): void {
  const isIntersectingNow = isIntersecting(entityA, entityB);
  const pairKey = getPairKey(entityA.id, entityB.id);
  const isPairActive = intersectingPairs.get(pairKey);

  if (!isIntersectingNow) {
    intersectingPairs.delete(pairKey);
    return;
  }

  const isDraggingCollision =
    entityA.body.isDragging || entityB.body.isDragging;

  if (isDraggingCollision) {
    resolveDraggingCollision(entityA, entityB);
    return;
  }

  if (!isPairActive) {
    intersectingPairs.set(pairKey, true);
    resolveKinematicCollision(entityA, entityB);
  }
}

export function runCollisionSystem(
  entities: SimEntity[],
  intersectingPairs: Map<string, boolean>,
): void {
  for (let i = 0; i < entities.length; i++) {
    const currentEntity = entities[i];

    for (let j = i + 1; j < entities.length; j++) {
      reactOnIntersecting(currentEntity, entities[j], intersectingPairs);
    }
  }
}
