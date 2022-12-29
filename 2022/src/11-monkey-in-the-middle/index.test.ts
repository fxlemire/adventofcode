import { getMonkeyNotes, monkeyInTheMiddlePart2 } from '.';

describe('Day 11: Monkey in the Middle', () => {
  describe('getMonkeyNotes', () => {
    //   it('should return the correct monkey notes', async () => {
    //     const result = await getMonkeyNotes('index.input.test.txt');
    //     const expected: MonkeyNotes = new Map();
    //     expected.set(0, {
    //       startingItems: [
    //         {
    //           currentValue: 79n,
    //           reset(m) {
    //             return this.currentValue % 79n === 0n && m === 0 ? 79n : this.currentValue;
    //           },
    //         },
    //         {
    //           currentValue: 98n,
    //           reset(m) {
    //             return this.currentValue % 98n === 0n && m === 0 ? 98n : this.currentValue;
    //           },
    //         },
    //       ],
    //       operation: (old: bigint) => old * 19n,
    //       test: {
    //         isDivisible: (worryLevel: bigint) => worryLevel % 23n === 0n,
    //         true: 2,
    //         false: 3,
    //       },
    //     });
    //     expected.set(1, {
    //       startingItems: [
    //         {
    //           currentValue: 54n,
    //           reset(m) {
    //             return this.currentValue % 79n === 0n && m === 1 ? 79n : this.currentValue;
    //           },
    //         },
    //         {
    //           currentValue: 65n,
    //           reset(m) {
    //             return this.currentValue % 65n === 0n && m === 1 ? 65n : this.currentValue;
    //           },
    //         },
    //         {
    //           currentValue: 75n,
    //           reset(m) {
    //             return this.currentValue % 75n === 0n && m === 1 ? 75n : this.currentValue;
    //           },
    //         },
    //         {
    //           currentValue: 74n,
    //           reset(m) {
    //             return this.currentValue % 74n === 0n && m === 1 ? 74n : this.currentValue;
    //           },
    //         },
    //       ],
    //       operation: (old: bigint) => old + 6n,
    //       test: {
    //         isDivisible: (worryLevel: bigint) => worryLevel % 19n === 0n,
    //         true: 2,
    //         false: 0,
    //       },
    //     });
    //     expected.set(2, {
    //       startingItems: [
    //         {
    //           currentValue: 79n,
    //           reset(m) {
    //             return this.currentValue % 79n === 0n && m === 2 ? 79n : this.currentValue;
    //           },
    //         },
    //         {
    //           currentValue: 60n,
    //           reset(m) {
    //             return this.currentValue % 60n === 0n && m === 2 ? 60n : this.currentValue;
    //           },
    //         },
    //         {
    //           currentValue: 97n,
    //           reset(m) {
    //             return this.currentValue % 97n === 0n && m === 2 ? 97n : this.currentValue;
    //           },
    //         },
    //       ],
    //       operation: (old: bigint) => old * old,
    //       test: {
    //         isDivisible: (worryLevel: bigint) => worryLevel % 13n === 0n,
    //         true: 1,
    //         false: 3,
    //       },
    //     });
    //     expected.set(3, {
    //       startingItems: [
    //         {
    //           currentValue: 74n,
    //           reset(m) {
    //             return this.currentValue % 79n === 0n && m === 3 ? 79n : this.currentValue;
    //           },
    //         },
    //       ],
    //       operation: (old: bigint) => old + 3n,
    //       test: {
    //         isDivisible: (worryLevel: bigint) => worryLevel % 17n === 0n,
    //         true: 0,
    //         false: 1,
    //       },
    //     });
    //     for (const [monkeyId, monkeyBag] of expected) {
    //       expect(JSON.stringify(result.get(monkeyId))).toStrictEqual(JSON.stringify(monkeyBag));
    //     }
    //   });
  });

  // describe('monkeyInTheMiddlePart1', () => {
  //   it('should return the correct monkey business level', async () => {
  //     const input = await getMonkeyNotes('index.input.test.txt');
  //     expect(monkeyInTheMiddlePart2(input, 20, 3n)).toEqual(10605);
  //   });
  // });

  describe('monkeyInTheMiddlePart2', () => {
    // (
    //   [
    //     [1, [2, 4, 3, 6]],
    //     [20, [99, 97, 8, 103]],
    //     [1000, [5204, 4792, 199, 5192]],
    //     [2000, [10419, 9577, 392, 10391]],
    //     [3000, [15638, 14358, 587, 15593]],
    //     [4000, [20858, 19138, 780, 20797]],
    //     [5000, [26075, 23921, 974, 26000]],
    //     [6000, [31294, 28702, 1165, 31204]],
    //     [7000, [36508, 33488, 1360, 36400]],
    //     [8000, [41728, 38268, 1553, 41606]],
    //     [9000, [46945, 43051, 1746, 46807]],
    //     [10000, [52166, 47830, 1938, 52013]],
    //   ] as const
    // ).forEach(([round, manipulationsCount]) => {
    //   it(`should return the correct monkey business level at round ${round}`, async () => {
    //     const input = await getMonkeyNotes('index.input.test.txt');
    //     const expected: Map<number, number> = new Map();
    //     manipulationsCount.forEach((manipulations, i) => {
    //       expected.set(i, manipulations);
    //     });
    //     expect(monkeyInTheMiddlePart2(input, round, 1)).toEqual(expected);
    //   });
    // });
    it('should return the correct monkey business level at round 10000', async () => {
      const input = await getMonkeyNotes('index.input.test.txt');
      expect(monkeyInTheMiddlePart2(input, 10000, 1)).toEqual(2713310158);
    });
  });
});
