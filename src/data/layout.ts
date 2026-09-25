export type Shape =
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; rx: number };

export type Icon =
  | 'play' | 'record' | 'back' | 'menu' | 'capture' | 'dot' | 'loop' | 'mute'
  | 'delete' | 'copy' | 'undo' | 'shift' | 'left' | 'right' | 'plus' | 'minus';

export interface Placed {
  id: string;
  shape: Shape;
  icon?: Icon;
}

/** Top view in viewBox units; proportions follow the real hardware layout. */
export const TOP_VIEW = { width: 1160, height: 540 };
export const BACK_VIEW = { width: 1160, height: 130 };

const circle = (cx: number, cy: number, r: number): Shape => ({ kind: 'circle', cx, cy, r });
const rect = (x: number, y: number, w: number, h: number, rx: number): Shape => ({ kind: 'rect', x, y, w, h, rx });
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const PAD_ROW_Y = [132, 206, 281, 356];
export const ENCODER_Y = 54;
export const STEP_Y = 473;
export const encoderX = (n: number) => 261 + 98 * (n - 1);
export const stepX = (n: number) => 237 + 49 * (n - 1);
/** Steps that start a beat (marked on the hardware). */
export const BEAT_STEPS = [1, 5, 9, 13];
/** Steps with a Shift function printed beneath them. */
export const STEP_ICON_STEPS = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16];

export const TOP_LAYOUT: Placed[] = [
  { id: 'display', shape: rect(28, 34, 124, 66, 4) },
  ...range(8).map((n) => ({ id: `encoder-${n}`, shape: circle(encoderX(n), ENCODER_Y, 21) })),
  { id: 'mic', shape: circle(1023, 54, 4) },
  { id: 'volume', shape: circle(1104, 60, 28) },
  { id: 'wheel', shape: circle(87, 198, 48) },
  { id: 'back', shape: circle(53, 310, 25), icon: 'back' },
  { id: 'note-session', shape: circle(120, 310, 25), icon: 'menu' },
  ...range(4).map((n) => ({ id: `track-${n}`, shape: rect(168, PAD_ROW_Y[n - 1] - 2, 26, 64, 13) })),
  ...range(4).flatMap((row) =>
    range(8).map((col) => ({
      id: `pad-${row}-${col}`,
      shape: rect(220 + 98 * (col - 1), PAD_ROW_Y[row - 1], 83, 60, 5),
    })),
  ),
  { id: 'capture', shape: circle(1037, 162, 25), icon: 'capture' },
  { id: 'sampling', shape: circle(1104, 162, 25), icon: 'dot' },
  { id: 'loop', shape: circle(1037, 236, 25), icon: 'loop' },
  { id: 'mute', shape: circle(1104, 236, 25), icon: 'mute' },
  { id: 'delete', shape: circle(1037, 311, 25), icon: 'delete' },
  { id: 'copy', shape: circle(1104, 311, 25), icon: 'copy' },
  { id: 'undo', shape: circle(1037, 386, 25), icon: 'undo' },
  { id: 'shift', shape: circle(1104, 386, 25), icon: 'shift' },
  { id: 'play', shape: circle(53, STEP_Y, 25), icon: 'play' },
  { id: 'record', shape: circle(120, STEP_Y, 25), icon: 'record' },
  ...range(16).map((n) => ({ id: `step-${n}`, shape: circle(stepX(n), STEP_Y, 17) })),
  { id: 'left', shape: circle(1028, STEP_Y, 15), icon: 'left' },
  { id: 'right', shape: circle(1112, STEP_Y, 15), icon: 'right' },
  { id: 'plus', shape: circle(1070, 450, 15), icon: 'plus' },
  { id: 'minus', shape: circle(1070, 496, 15), icon: 'minus' },
];

export const BACK_LAYOUT: Placed[] = [
  { id: 'power', shape: circle(52, 70, 15) },
  { id: 'audio-out', shape: circle(110, 70, 10) },
  { id: 'audio-in', shape: circle(158, 70, 10) },
  { id: 'usb-a', shape: rect(958, 62, 38, 16, 2) },
  { id: 'usb-c', shape: rect(1058, 63, 34, 14, 7) },
];

export function centerOf(shape: Shape): { cx: number; cy: number; r: number } {
  if (shape.kind === 'circle') return { cx: shape.cx, cy: shape.cy, r: shape.r };
  return { cx: shape.x + shape.w / 2, cy: shape.y + shape.h / 2, r: Math.max(shape.w, shape.h) / 2 };
}
