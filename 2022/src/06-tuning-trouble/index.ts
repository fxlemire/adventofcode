import { input } from './index.input';

export function tuningTrouble(input: string, markerLength: number): number {
  for (let i = 0; i <= input.length - markerLength; ++i) {
    const marker = input.slice(i, i + markerLength);

    if (marker.length === new Set(marker.split('')).size) {
      return i + markerLength;
    }
  }

  return -1;
}

export function runDaySix() {
  return [tuningTrouble(input, 4), tuningTrouble(input, 14)];
}
