import type { Vector2 } from '../shared/lib/types/types';

export function renderEntityDom(
  element: HTMLDivElement | null,
  position: Vector2,
): void {
  if (!element) return;

  element.style.transform = `translate(${position.x}px, ${position.y}px)`;
}
