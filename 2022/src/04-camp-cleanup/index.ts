import { input } from './index.input';

export function campCleanupPart1(input: Array<Array<string>>) {
  const inputAsNumber = input.map((pair) =>
    pair
      .map((range) => range.split('-').map(Number))
      .sort(([p1Start, p1End], [p2Start, p2End]) => {
        const pair1Length = p1End - p1Start;
        const pair2Length = p2End - p2Start;

        if (pair1Length > pair2Length) {
          return 1;
        } else if (pair2Length > pair1Length) {
          return -1;
        } else {
          return 0;
        }
      }),
  );

  const pairsContainedQty = inputAsNumber.reduce(
    (acc, [[p1Start, p1End], [p2Start, p2End]]) => (p1Start >= p2Start && p1End <= p2End ? acc + 1 : acc),
    0,
  );

  return pairsContainedQty;
}

export function campCleanupPart2(input: Array<Array<string>>) {
  const inputAsNumber = input.map((pair) =>
    pair
      .map((range) => range.split('-').map(Number))
      .sort((pair1, pair2) => {
        if (pair2[0] < pair1[0]) {
          return 1;
        } else if (pair1[0] < pair2[0]) {
          return -1;
        } else {
          return 0;
        }
      }),
  );

  const overlapContainedQty = inputAsNumber.reduce(
    (acc, [[_, p1End], [p2Start, __]]) => (p2Start <= p1End ? acc + 1 : acc),
    0,
  );

  return overlapContainedQty;
}

export function runDayFour() {
  return [campCleanupPart1(input), campCleanupPart2(input)];
}
