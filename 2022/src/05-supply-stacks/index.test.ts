import { getStackUnloadingInstructions, StackUnloadingInstructions, supplyStacksPart1, supplyStacksPart2 } from '.';

describe('Day 5: Supply Stacks', () => {
  describe('getStackUnloadingInstructions', () => {
    it('should return the proper stack unloading instructions', async () => {
      expect(await getStackUnloadingInstructions('index.input.test.txt')).toEqual({
        stacks: [['Z', 'N'], ['M', 'C', 'D'], ['P']],
        instructions: [
          [1, 2, 1],
          [3, 1, 3],
          [2, 2, 1],
          [1, 1, 2],
        ],
      });
    });
  });

  describe('supplyStacksPart1', () => {
    it('should return the correct top crates when moved one by one', () => {
      const input: StackUnloadingInstructions = {
        stacks: [['Z', 'N'], ['M', 'C', 'D'], ['P']],
        instructions: [
          [1, 2, 1],
          [3, 1, 3],
          [2, 2, 1],
          [1, 1, 2],
        ],
      };

      expect(supplyStacksPart1(input)).toBe('CMZ');
    });
  });

  describe('supplyStacksPart2', () => {
    it('should return the correct top crates when moved in chunks', () => {
      const input: StackUnloadingInstructions = {
        stacks: [['Z', 'N'], ['M', 'C', 'D'], ['P']],
        instructions: [
          [1, 2, 1],
          [3, 1, 3],
          [2, 2, 1],
          [1, 1, 2],
        ],
      };

      expect(supplyStacksPart2(input)).toEqual('MCD');
    });
  });
});
