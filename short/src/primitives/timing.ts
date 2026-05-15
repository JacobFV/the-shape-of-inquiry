import {interpolate} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const appear = (frame: number, at: number, dur = 16) =>
  interpolate(frame, [at, at + dur], [0, 1], clamp);

export const exit = (frame: number, start: number, dur = 16) =>
  interpolate(frame, [start, start + dur], [1, 0], clamp);

export const sceneOpacity = (frame: number, duration: number, fade = 10) =>
  Math.min(appear(frame, 0, fade), exit(frame, duration - fade, fade));

export const slideY = (frame: number, from: number, to = 0, at = 0, dur = 18) =>
  interpolate(frame, [at, at + dur], [from, to], clamp);

export const pulse = (frame: number, period = 60) =>
  0.5 + 0.5 * Math.sin((frame / period) * Math.PI * 2);
