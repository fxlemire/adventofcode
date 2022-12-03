import { campCleanupPart1, campCleanupPart2 } from '.';

describe('Day 4: Camp Cleanup', () => {
  describe('campCleanupPart1', () => {
    it('should return the correct quantity of pairs whose section fully contains the other', () => {
      const inputTest = [
        ['2-4', '6-8'],
        ['2-3', '4-5'],
        ['5-7', '7-9'],
        ['2-8', '3-7'],
        ['6-6', '4-6'],
        ['2-6', '4-8'],
      ];

      expect(campCleanupPart1(inputTest)).toEqual(2);
    });
  });

  describe('campCleanupPart2', () => {
    it('should return the correct quantity of pairs whose sections do not overlap', () => {
      const inputTest = [
        ['2-4', '6-8'],
        ['2-3', '4-5'],
        ['5-7', '7-9'],
        ['2-8', '3-7'],
        ['6-6', '4-6'],
        ['2-6', '4-8'],
      ];

      expect(campCleanupPart2(inputTest)).toEqual(4);
    });
  });
});
