import { createEngineState } from './createEngineState';
import { engineTick } from './engineTick';

import type {
  EngineState,
  EngineTickOptions,
  SceneRuntimeConfig,
  SimEntity,
} from './engine.types';

export class Engine {
  readonly state: EngineState;

  readonly config: SceneRuntimeConfig;

  constructor(entities: SimEntity[], config: SceneRuntimeConfig) {
    this.state = createEngineState(entities);
    this.config = config;
  }

  tick(now: number, options?: EngineTickOptions): void {
    engineTick(this.state, this.config, now, options);
  }
}
