import { rockPaperScissorsPart1, rockPaperScissorsPart2 } from '.';

describe('Day 2: Rock Paper Scissors', () => {
  describe('rockPaperScissorsPart1', () => {
    it('should return total score', async () => {
      const input = ['A Y', 'B X', 'C Z'];

      expect(rockPaperScissorsPart1(input)).toBe(15);
    });
  });

  describe('rockPaperScissorsPart2', () => {
    it('should return total score', async () => {
      const input = ['A Y', 'B X', 'C Z'];

      expect(rockPaperScissorsPart2(input)).toBe(12);
    });
  });
});
