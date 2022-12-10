import { cathodeRayTubePart1, cathodeRayTubePart2, getOperations, SignalStrengths } from '.';

describe('Day 10: Cathode-Ray Tube', () => {
  describe('getOperations', () => {
    it('should return the correct array of operations', async () => {
      const operations = await getOperations('index.input.test.txt');
      const expected = [['noop'], ['addx', 3], ['addx', -5]];

      expect(operations).toEqual(expected);
    });
  });

  describe('cathodeRayTubePart1', () => {
    it('should return the correct signal strengths', async () => {
      const operations = await getOperations('index.input.test2.txt');
      const expectedSignals: SignalStrengths = {
        '20': 420,
        '60': 1140,
        '100': 1800,
        '140': 2940,
        '180': 2880,
        '220': 3960,
        total: 13140,
      };

      expect(cathodeRayTubePart1(operations)).toEqual(expectedSignals);
    });
  });

  describe('cathodeRayTubePart2', () => {
    it('should return the correct CRT image', async () => {
      const operations = await getOperations('index.input.test2.txt');
      const expectedImage = [
        '##..##..##..##..##..##..##..##..##..##..',
        '###...###...###...###...###...###...###.',
        '####....####....####....####....####....',
        '#####.....#####.....#####.....#####.....',
        '######......######......######......####',
        '#######.......#######.......#######.....',
      ];

      expect(cathodeRayTubePart2(operations)).toEqual(expectedImage);
    });
  });
});
