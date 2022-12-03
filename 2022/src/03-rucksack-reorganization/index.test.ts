import {
  getPriority,
  rucksackReorganizationPart1,
  rucksackReorganizationPart2,
  rucksackReorganizationPart2WithIntersect,
} from '.';

describe('Day 3: Rucksack Reorganization', () => {
  describe('getPriority', () => {
    it('should return the correct priority for lowercase characters', () => {
      expect(getPriority('a')).toEqual(1);
      expect(getPriority('p')).toEqual(16);
      expect(getPriority('t')).toEqual(20);
      expect(getPriority('v')).toEqual(22);
      expect(getPriority('z')).toEqual(26);
    });

    it('should return the correct priority for uppercase characters', () => {
      expect(getPriority('A')).toEqual(27);
      expect(getPriority('L')).toEqual(38);
      expect(getPriority('P')).toEqual(42);
      expect(getPriority('Z')).toEqual(52);
    });
  });

  describe('rucksackReorganizationPart1', () => {
    it('should return the correct sum of priorities according to common items in each rucksack', () => {
      const input = [
        'vJrwpWtwJgWrhcsFMMfFFhFp',
        'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
        'PmmdzqPrVvPwwTWBwg',
        'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
        'ttgJtRGJQctTZtZT',
        'CrZsJsPPZsGzwwsLwLmpwMDw',
      ];

      expect(rucksackReorganizationPart1(input)).toEqual(157);
    });
  });

  describe('rucksackReorganizationPart2', () => {
    (
      [
        ['with dictionary', rucksackReorganizationPart2],
        ['with intersection', rucksackReorganizationPart2WithIntersect],
      ] as const
    ).forEach(([type, fn]) => {
      it(`should return the correct sum of priorities according to unique badge in each group of rucksacks ${type}`, () => {
        const input = [
          'vJrwpWtwJgWrhcsFMMfFFhFp',
          'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
          'PmmdzqPrVvPwwTWBwg',
          'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
          'ttgJtRGJQctTZtZT',
          'CrZsJsPPZsGzwwsLwLmpwMDw',
        ];

        expect(fn(input)).toEqual(70);
      });
    });
  });
});
