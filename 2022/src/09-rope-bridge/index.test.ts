import { ropeBridgePart1, ropeBridgePart2 } from '.';
import { inputPart1, inputPart2 } from './index.input.test';

describe('Day 9: Rope Bridge', () => {
  describe('ropeBridgePart1', () => {
    it('should return the correct number of visited positions by the tail of the rope of length 2', () => {
      expect(ropeBridgePart1(inputPart1)).toBe(13);
    });
  });

  describe('ropeBridgePart2', () => {
    it('should return the correct number of visited positions by the tail of the rope of length 10 when it does not move', () => {
      expect(ropeBridgePart2(inputPart1)).toBe(1);
    });

    it('should return the correct number of visited positions by the tail of the rope of length 10', () => {
      expect(ropeBridgePart2(inputPart2)).toBe(36);
    });
  });
});
