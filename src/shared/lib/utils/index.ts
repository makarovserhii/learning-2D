import type { Vector2 } from '../types/types';

export const randomInRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

export const getRandomVelocity = (
  minSpeed: number,
  maxSpeed: number,
): Vector2 => {
  const angle = Math.random() * Math.PI * 2;
  const speed = randomInRange(minSpeed, maxSpeed);

  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
};
