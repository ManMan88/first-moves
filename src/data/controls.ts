export type ControlGroup =
  | 'screen'
  | 'navigation'
  | 'transport'
  | 'function'
  | 'track'
  | 'pad'
  | 'step'
  | 'encoder'
  | 'port';

export interface Control {
  id: string;
  name: string;
  group: ControlGroup;
  does: string;
  shift?: string;
}

const STEP_SHIFT: Record<number, string> = {
  1: 'Open the Set Overview, where all your Sets live.',
  2: 'Open the Setup menu (Wi-Fi, updates, MIDI, brightness and more).',
  3: 'Open Workflow Settings (quantize, step grid, count-in, autoload, time signature).',
  5: 'Change the tempo (BPM).',
  6: 'Metronome settings.',
  7: 'Set the groove (swing) amount.',
  8: 'Turn the 16 Pitches layout on or off (drum kits).',
  9: 'Choose the key and scale for melodic sounds.',
  10: 'Turn Full Velocity on or off (every hit plays at full strength).',
  11: 'Repeat and arpeggiator settings.',
  14: 'Get the next empty clip slot ready: a fresh clip.',
  15: 'Double the loop (copies the notes into the new half).',
  16: 'Quantize: snap the notes in the clip to the grid.',
};

const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const ROW_NAME = ['top', 'second', 'third', 'bottom'];

const single: Control[] = [
  {
    id: 'display', name: 'Display', group: 'screen',
    does: 'Shows the current sound, menus and values. Touch a knob to see what it changes.',
  },
  {
    id: 'wheel', name: 'Wheel', group: 'navigation',
    does: 'Turn it to scroll through menus, sounds and values. Press it to confirm a choice.',
  },
  {
    id: 'back', name: 'Back', group: 'navigation',
    does: 'Steps out of a menu or the sound browser. Hold it to close the current view.',
  },
  {
    id: 'note-session', name: 'Note/Session', group: 'navigation',
    does: 'Switches between Note Mode (build one track) and Session Mode (launch clips). Hold it to peek at the other mode.',
  },
  {
    id: 'play', name: 'Play', group: 'transport',
    does: 'Starts and stops playback.',
    shift: 'In Session Mode: restart all playing clips from their beginning.',
  },
  {
    id: 'record', name: 'Record', group: 'transport',
    does: 'Starts or stops recording what you play (and knob moves) into a clip. If Move was stopped, playback starts too, after a count-in.',
  },
  {
    id: 'capture', name: 'Capture', group: 'function',
    does: 'Turns what you just played without recording into a clip. Pressed while stopped, it also guesses your tempo.',
    shift: 'Clear what Capture has been listening to.',
  },
  {
    id: 'sampling', name: 'Sampling', group: 'function',
    does: 'Opens Sampling Mode to record sound from the microphone, the audio input, USB-C, or Move itself.',
  },
  {
    id: 'loop', name: 'Loop', group: 'function',
    does: 'Loop Mode: the step buttons show the bars of the clip, so you can change its length or copy whole bars.',
  },
  {
    id: 'mute', name: 'Mute', group: 'function',
    does: 'Mutes or unmutes a track or a single drum pad.',
    shift: 'Solo (hold Shift + Mute and press a track button).',
  },
  {
    id: 'delete', name: 'Delete', group: 'function',
    does: 'Removes things: hold it and press the Set, clip, pad or notes you want gone.',
  },
  {
    id: 'copy', name: 'Copy', group: 'function',
    does: 'Copies Sets, notes, steps, bars or clips. Press it again to empty the clipboard.',
  },
  {
    id: 'undo', name: 'Undo', group: 'function',
    does: 'Takes back your last action.',
    shift: 'Redo.',
  },
  {
    id: 'shift', name: 'Shift', group: 'function',
    does: 'Hold it to reach the second job of other controls. While you hold it, icons appear under several step buttons: each opens a setting.',
  },
  {
    id: 'left', name: 'Left arrow', group: 'navigation',
    does: 'Moves to the previous bar of a clip. Hold a step and press it to nudge notes earlier.',
  },
  {
    id: 'right', name: 'Right arrow', group: 'navigation',
    does: 'Moves to the next bar of a clip. Hold a step and press it to nudge notes later.',
  },
  {
    id: 'plus', name: 'Plus (+)', group: 'navigation',
    does: 'Moves a melodic instrument up an octave. Hold a step and press it to raise the notes on that step.',
  },
  {
    id: 'minus', name: 'Minus (−)', group: 'navigation',
    does: 'Moves a melodic instrument down an octave. Hold a step and press it to lower the notes on that step.',
  },
  {
    id: 'volume', name: 'Volume knob', group: 'encoder',
    does: 'Sets the overall volume. Hold a track button while turning it for that track, a pad for that pad, or a step for how hard its notes play.',
  },
  { id: 'mic', name: 'Microphone', group: 'port', does: 'Built-in microphone for recording samples.' },
  {
    id: 'power', name: 'Power button', group: 'port',
    does: 'Turns Move on. To turn it off, press it, then press the wheel. Hold it for ten seconds to force Move off.',
  },
  { id: 'audio-out', name: 'Audio out', group: 'port', does: 'Headphones or speakers (3.5 mm stereo jack).' },
  { id: 'audio-in', name: 'Audio in', group: 'port', does: 'Plug in another sound source to sample it (3.5 mm stereo jack).' },
  { id: 'usb-a', name: 'USB-A', group: 'port', does: 'Connect a USB MIDI keyboard or controller.' },
  { id: 'usb-c', name: 'USB-C', group: 'port', does: 'Charging, and connecting Move to a computer, phone or tablet.' },
];

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const tracks: Control[] = range(4).map((n) => ({
  id: `track-${n}`,
  name: `Track ${n} button`,
  group: 'track',
  does: `Selects track ${n}. Hold it to peek at that track without switching to it.`,
  shift: 'Open this track’s settings.',
}));

const encoders: Control[] = range(8).map((n) => ({
  id: `encoder-${n}`,
  name: `Knob ${n}`,
  group: 'encoder',
  does: 'Changes one setting of the current instrument or effect. Touch it to see which one on the display.',
  shift: 'Fine adjustment: smaller changes per turn.',
}));

const pads: Control[] = range(4).flatMap((row) =>
  range(8).map((col) => ({
    id: `pad-${row}-${col}`,
    name: `Pad (${ROW_NAME[row - 1]} row, ${ORDINAL[col - 1]} from left)`,
    group: 'pad' as const,
    does: 'Plays a note or a drum sound. Hit softly for a quiet note, harder for a loud one. Pressing harder while holding shapes some sounds.',
  })),
);

const steps: Control[] = range(16).map((n) => ({
  id: `step-${n}`,
  name: `Step ${n}`,
  group: 'step',
  does: `Adds or removes the selected note on step ${n} of the pattern (a 16th note, by default). In Loop Mode it stands for bar ${n} instead.`,
  shift: STEP_SHIFT[n],
}));

export const CONTROLS: Control[] = [...single, ...tracks, ...encoders, ...pads, ...steps];
export const CONTROL_MAP = new Map(CONTROLS.map((c) => [c.id, c]));

export const ALIASES: Record<string, string[]> = {
  pads: pads.map((p) => p.id),
  'drum-pads': range(4).flatMap((row) => range(4).map((col) => `pad-${row}-${col}`)),
  'right-pads': range(4).flatMap((row) => range(4).map((col) => `pad-${row}-${col + 4}`)),
  steps: steps.map((s) => s.id),
  encoders: encoders.map((e) => e.id),
  tracks: tracks.map((t) => t.id),
  ...Object.fromEntries(range(8).map((col) => [`column-${col}`, range(4).map((row) => `pad-${row}-${col}`)])),
  ...Object.fromEntries(range(4).map((row) => [`row-${row}`, range(8).map((col) => `pad-${row}-${col}`)])),
};

/** One group of control ids per token in `spec`, in order. Throws on an unknown token. */
export function resolveSequence(spec?: string): string[][] {
  if (!spec) return [];
  return spec
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((token) => {
      if (ALIASES[token]) return [...ALIASES[token]];
      if (CONTROL_MAP.has(token)) return [token];
      throw new Error(`Unknown control id "${token}". Use an id or alias from src/data/controls.ts.`);
    });
}

export function resolveControls(spec?: string): string[] {
  return [...new Set(resolveSequence(spec).flat())];
}
