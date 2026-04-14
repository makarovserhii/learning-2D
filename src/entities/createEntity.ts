import type { EntityBody, EntityType } from '../shared/lib/types/types';

import type { SimEntity } from '../engine/engine.types';

export function createEntity(
  id: string,
  kind: EntityType,
  bodyTemplate: EntityBody,
): SimEntity {
  return {
    id,
    kind,
    body: structuredClone(bodyTemplate),
  };
}
