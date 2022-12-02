import { elvesAndCalories } from './index.input';

export function calorieCountingPart1(caloriesCarried: Array<number | undefined>): number {
  let max = 0;
  let current = 0;

  caloriesCarried.forEach((calories) => {
    if (calories === undefined) {
      if (current > max) {
        max = current;
      }

      current = 0;
    } else {
      current += calories;
    }
  });

  return max;
}

export function calorieCountingPart2(caloriesCarried: Array<number | undefined>): number {
  const topThree = [0, 0, 0];

  caloriesCarried.reduce((acc, calories, index) => {
    // acc should never be undefined so make ts stop complaining
    if (acc === undefined) {
      return 0;
    }

    if (calories === undefined || index === caloriesCarried.length - 1) {
      const elfTotal = calories !== undefined && index === caloriesCarried.length - 1 ? calories : acc;
      const indexToReplace = topThree.findIndex((topCalories) => topCalories < elfTotal);

      if (indexToReplace >= 0) {
        topThree[indexToReplace] = elfTotal;
        topThree.sort((a, b) => a - b);
      }

      return 0;
    } else {
      return acc + calories;
    }
  }, 0);

  return topThree.reduce((acc, calories) => acc + calories, 0);
}

export function runDayOne() {
  return [calorieCountingPart1(elvesAndCalories), calorieCountingPart2(elvesAndCalories)];
}
