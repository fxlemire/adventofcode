import { input } from './index.input';

export function getPriority(letter: string): number {
  const letterCharCode = letter.charCodeAt(0);

  const isUpperCase = letterCharCode >= 'A'.charCodeAt(0) && letterCharCode <= 'Z'.charCodeAt(0);
  const subtractBase = isUpperCase ? 'A'.charCodeAt(0) - 26 : 'a'.charCodeAt(0);

  return letterCharCode - subtractBase + 1;
}

function sum(numbers: Array<number>) {
  return numbers.reduce((acc, p) => acc + p, 0);
}

export function rucksackReorganizationPart1(input: Array<string>): number {
  const rucksacks = input.map((input) => {
    const length = input.length;
    const half = length / 2;
    return [
      Array.from(new Set(input.slice(0, half).split('').sort())),
      Array.from(new Set(input.slice(half, length).split('').sort())),
    ];
  });

  const priorities = rucksacks.map(([firstHalf, secondHalf]) => {
    let firstHalfIndex = 0;
    let secondHalfIndex = 0;

    while (
      firstHalf[firstHalfIndex] !== secondHalf[secondHalfIndex] &&
      firstHalfIndex < firstHalf.length &&
      secondHalfIndex < secondHalf.length
    ) {
      while (firstHalf[firstHalfIndex] < secondHalf[secondHalfIndex]) {
        ++firstHalfIndex;
      }
      while (secondHalf[secondHalfIndex] < firstHalf[firstHalfIndex]) {
        ++secondHalfIndex;
      }
    }

    return getPriority(firstHalf[firstHalfIndex]);
  });

  return sum(priorities);
}

export function rucksackReorganizationPart2(input: Array<string>): number {
  const GROUP_SIZE = 3;
  const groups: Array<Array<Array<string>>> = [];

  for (let i = 0; i < input.length; i += GROUP_SIZE) {
    groups.push(input.slice(i, i + GROUP_SIZE).map((rucksack) => rucksack.split('')));
  }

  const badges = groups.map((group) => {
    const possibleBadges: Record<string, number> = {};
    let badge: string | undefined;

    group.forEach((rucksack) => {
      const rucksackSet = Array.from(new Set(rucksack));
      badge = rucksackSet.find((possibleBadge) => {
        possibleBadges[possibleBadge] = possibleBadges[possibleBadge] ? ++possibleBadges[possibleBadge] : 1;
        return possibleBadges[possibleBadge] === GROUP_SIZE;
      });
    });

    if (!badge) {
      throw new Error('Could not find a badge.');
    }

    return badge;
  });

  const badgePriorities = badges.map(getPriority);

  return sum(badgePriorities);
}

export function rucksackReorganizationPart2WithIntersect(input: Array<string>): number {
  const GROUP_SIZE = 3;
  const groups: Array<Array<Array<string>>> = [];

  for (let i = 0; i < input.length; i += GROUP_SIZE) {
    groups.push(input.slice(i, i + GROUP_SIZE).map((rucksack) => Array.from(new Set(rucksack.split('').sort()))));
  }

  const badges = groups.map(([firstGroup, secondGroup, thirdGroup]) => {
    let firstGroupIndex = 0;
    let secondGroupIndex = 0;
    let thirdGroupIndex = 0;

    while (
      (firstGroup[firstGroupIndex] !== secondGroup[secondGroupIndex] ||
        firstGroup[firstGroupIndex] !== thirdGroup[thirdGroupIndex] ||
        secondGroup[secondGroupIndex] !== thirdGroup[thirdGroupIndex]) &&
      firstGroupIndex < firstGroup.length &&
      secondGroupIndex < secondGroup.length &&
      thirdGroupIndex < thirdGroup.length
    ) {
      while (
        firstGroup[firstGroupIndex] < secondGroup[secondGroupIndex] ||
        firstGroup[firstGroupIndex] < thirdGroup[thirdGroupIndex]
      ) {
        ++firstGroupIndex;
      }
      while (
        secondGroup[secondGroupIndex] < firstGroup[firstGroupIndex] ||
        secondGroup[secondGroupIndex] < thirdGroup[thirdGroupIndex]
      ) {
        ++secondGroupIndex;
      }
      while (
        thirdGroup[thirdGroupIndex] < firstGroup[firstGroupIndex] ||
        thirdGroup[thirdGroupIndex] < secondGroup[secondGroupIndex]
      ) {
        ++thirdGroupIndex;
      }
    }

    return firstGroup[firstGroupIndex];
  });

  const badgePriorities = badges.map(getPriority);

  return sum(badgePriorities);
}

export function runDayThree() {
  return [rucksackReorganizationPart1(input), rucksackReorganizationPart2(input)];
}
