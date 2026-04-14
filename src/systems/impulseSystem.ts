import { getRandomVelocity } from '../shared/lib/utils';

import type { SimEntity } from '../engine/engine.types';

export function randomizeAllVelocities(
  entities: SimEntity[],
  minSpeed: number,
  maxSpeed: number,
): void {
  for (const entity of entities) {
    entity.body.velocity = getRandomVelocity(minSpeed, maxSpeed);
  }
}
