import { tuningTrouble } from '.';

describe('Day 6: Tuning Trouble', () => {
  describe('tuningTrouble', () => {
    it.each([
      [4, [7, 5, 6, 10, 11]],
      [14, [19, 23, 23, 29, 26]],
    ])('should return the correct character after which a marker of length %i appears', (length, results) => {
      expect(tuningTrouble('mjqjpqmgbljsphdztnvjfqwrcgsmlb', length)).toBe(results[0]);
      expect(tuningTrouble('bvwbjplbgvbhsrlpgdmjqwftvncz', length)).toBe(results[1]);
      expect(tuningTrouble('nppdvjthqldpwncqszvftbrmjlhg', length)).toBe(results[2]);
      expect(tuningTrouble('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', length)).toBe(results[3]);
      expect(tuningTrouble('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', length)).toBe(results[4]);
    });
  });
});
