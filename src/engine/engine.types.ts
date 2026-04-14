import type {
  EntityBody,
  EntityType,
  PointerState,
} from '../shared/lib/types/types';

export type SimEntity = {
  id: string;
  kind: EntityType;
  body: EntityBody;
};

export type SceneRuntimeConfig = {
  width: number;
  height: number;
  maxDt: number;
  dragReleaseMultiplier: number;
  clickSpeedMin: number;
  clickSpeedMax: number;
};

export type EngineState = {
  entities: SimEntity[];
  pointer: PointerState;
  intersectingPairs: Map<string, boolean>;
  lastTime: number;
  fpsFrames: number;
  fpsLastSampleTime: number;
};

export type EngineTickCallbacks = {
  onFpsSample?: (fps: number) => void;
};

export type EngineTickOptions = EngineTickCallbacks & {
  /** When true, simulation runs slower (e.g. CTA hover). */
  slowMode?: boolean;
};
