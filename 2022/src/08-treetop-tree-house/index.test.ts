import { treetopTreeHousePart1, treetopTreeHousePart2 } from '.';
import { input } from './index.input.test';

describe('Day 8: Treetop Tree House', () => {
  const trees = input.map((row) => row.split('').map(Number));

  describe('treetopTreeHousePart1', () => {
    it('should return the correct total of visible trees', () => {
      expect(treetopTreeHousePart1(trees)).toBe(21);
    });
  });

  describe('treetopTreeHousePart2', () => {
    it('should return the highest scenic score possible', () => {
      expect(treetopTreeHousePart2(trees)).toBe(8);
    });
  });
});
