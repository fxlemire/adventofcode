import { calorieCountingPart1, calorieCountingPart2 } from '.';

describe('Day 1: Calorie Counting', () => {
  describe('calorieCountingPart1', () => {
    it('should return highest calories', async () => {
      const input = [
        1000,
        2000,
        3000,
        undefined,
        4000,
        undefined,
        5000,
        6000,
        undefined,
        7000,
        8000,
        9000,
        undefined,
        10000,
      ];

      expect(calorieCountingPart1(input)).toBe(24000);
    });

    it('should return highest calories when single item', async () => {
      const input = [
        1000,
        2000,
        3000,
        undefined,
        34000,
        undefined,
        5000,
        6000,
        undefined,
        7000,
        8000,
        9000,
        undefined,
        10000,
      ];

      expect(calorieCountingPart1(input)).toBe(34000);
    });
  });

  describe('calorieCountingPart2', () => {
    it('should return highest three calories total', async () => {
      const input = [
        1000,
        2000,
        3000,
        undefined,
        4000,
        undefined,
        5000,
        6000,
        undefined,
        7000,
        8000,
        9000,
        undefined,
        10000,
      ];

      expect(calorieCountingPart2(input)).toBe(45000);
    });

    it('should return highest calories when single item is among top three', async () => {
      const input = [
        1000,
        2000,
        3000,
        undefined,
        34000,
        undefined,
        5000,
        6000,
        undefined,
        7000,
        8000,
        9000,
        undefined,
        10000,
      ];
      const expected = 34000 + 24000 + 11000;

      expect(calorieCountingPart2(input)).toBe(expected);
    });
  });
});
