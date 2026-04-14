export type FpsStateSlice = {
  fpsFrames: number;
  fpsLastSampleTime: number;
};

export function sampleFps(
  state: FpsStateSlice,
  now: number,
  onSample?: (fps: number) => void,
): void {
  state.fpsFrames += 1;

  if (state.fpsLastSampleTime === 0) {
    state.fpsLastSampleTime = now;
    return;
  }

  const elapsed = now - state.fpsLastSampleTime;

  if (elapsed >= 1000) {
    const fps = Math.round((state.fpsFrames * 1000) / elapsed);
    onSample?.(fps);
    state.fpsFrames = 0;
    state.fpsLastSampleTime = now;
  }
}
