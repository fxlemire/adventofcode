import { getXXX, xxxPart1, xxxPart2 } from '.';

describe('Day XX: ', () => {
  describe('getXXX', () => {
    it('should', async () => {
      const result = await getXXX('index.input.test.txt');
      expect(result).toEqual(['']);
    });
  });

  describe('xxxPart1', () => {
    it('should', async () => {
      const input = await getXXX('index.input.test.txt');
      expect(xxxPart1(input)).toEqual(0);
    });
  });

  describe('xxxPart2', () => {
    it('should', async () => {
      const input = await getXXX('index.input.test.txt');
      expect(xxxPart2(input)).toEqual(0);
    });
  });
});
