export interface Part {
  n: number;
  title: string;
  blurb: string;
}

export const PARTS: Part[] = [
  { n: 0, title: 'Meet your Move', blurb: 'Get to know the hardware and get it ready to play.' },
  { n: 1, title: 'First sounds', blurb: 'Sets, tracks, the three views, playing the pads and choosing sounds.' },
  { n: 2, title: 'Make a beat', blurb: 'Steps, tempo, recording, Capture, editing and loops.' },
  { n: 3, title: 'Melody & bass', blurb: 'Basslines, chords, the arpeggiator and shaping your sounds.' },
  { n: 4, title: 'Build a song', blurb: 'Session Mode, mixing and performing.' },
  { n: 5, title: 'Sampling & audio', blurb: 'Record the world around you and turn it into music.' },
  { n: 6, title: 'Beyond the box', blurb: 'Move Manager, Cloud, Link, MIDI and Live.' },
];
