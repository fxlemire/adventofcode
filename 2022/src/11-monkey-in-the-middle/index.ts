import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type MonkeyBag = {
  startingItems: Array<number>;
  operation: (old: number) => number;
  test: {
    isDivisible: (worryLevel: number) => number;
    true: number;
    false: number;
  };
};
export type MonkeyNotes = Map<number, MonkeyBag>;

let lcm = 1;

export async function getMonkeyNotes(filename: string): Promise<MonkeyNotes> {
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, filename)),
  });

  const monkeyNotes: MonkeyNotes = new Map();
  let currentMonkey: number;
  let _lcm = 1;

  const lineReader = (line: string): void => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('Monkey')) {
      currentMonkey = Number(trimmedLine.split(' ')[1].charAt(0));
      monkeyNotes.set(currentMonkey, {} as any);
    } else if (trimmedLine.startsWith('Starting items:')) {
      const startingItems: MonkeyBag['startingItems'] = trimmedLine
        .split('Starting items:')[1]
        .split(',')
        .map((n) => Number(n));
      monkeyNotes.get(currentMonkey)!.startingItems = startingItems;
    } else if (trimmedLine.startsWith('Operation')) {
      const [_, operator, quantity] = trimmedLine.split(' = ')[1].split(' ');
      let operation: MonkeyBag['operation'];

      if (operator === '+') {
        operation = (old: number) => old + (quantity === 'old' ? old : Number(quantity));
      } else if (operator === '-') {
        operation = (old: number) => old - (quantity === 'old' ? old : Number(quantity));
      } else if (operator === '*') {
        operation = (old: number) => old * (quantity === 'old' ? old : Number(quantity));
      } else if (operator === '/') {
        operation = (old: number) => old / (quantity === 'old' ? old : Number(quantity));
      } else {
        throw new Error(`unexpected operator: ${operator}`);
      }

      monkeyNotes.set(currentMonkey, {
        ...monkeyNotes.get(currentMonkey),
        operation,
      } as MonkeyBag);
    } else if (trimmedLine.startsWith('Test')) {
      const [_, divisibleBy] = trimmedLine.split(' by ');
      _lcm *= Number(divisibleBy);
      monkeyNotes.get(currentMonkey)!.test = {
        isDivisible: (worryLevel: number) => worryLevel % Number(divisibleBy) === 0,
      } as any;
    } else if (trimmedLine.startsWith('If true:')) {
      const monkeyId = trimmedLine.split(' to monkey ')[1];
      monkeyNotes.get(currentMonkey)!.test.true = Number(monkeyId);
    } else if (trimmedLine.startsWith('If false:')) {
      const monkeyId = trimmedLine.split(' to monkey ')[1];
      monkeyNotes.get(currentMonkey)!.test.false = Number(monkeyId);
    }
  };

  rl.on('line', lineReader);

  return new Promise((res) => {
    rl.on('close', () => {
      lcm = _lcm;
      res(monkeyNotes);
    });
  });
}

export function monkeyInTheMiddlePart1(monkeyNotes: MonkeyNotes, rounds: number, reduceWorryBy: number): number {
  const reduceWorry = (worry: number) => worry / reduceWorryBy;
  const manipulationsQuantityPerMonkey: Map<number, number> = new Map();
  for (const monkeyId of monkeyNotes.keys()) {
    manipulationsQuantityPerMonkey.set(monkeyId, 0);
  }

  // each rounds go monkey by monkey
  // monkey inspects item where number is worry level, one by one
  // worry level is processed by operation
  // test worry level and throw accordingly
  // monkey manipulated an item, so increment

  for (let round = 0; round < rounds; ++round) {
    for (const [monkeyId, monkeyBag] of monkeyNotes.entries()) {
      for (const itemWorryLevel of [...monkeyBag.startingItems]) {
        const newItemWorryLevel = monkeyBag.operation(itemWorryLevel);
        let reducedWorryLevel = reduceWorry(newItemWorryLevel);

        const monkeyIdToThrowAt = monkeyBag.test[monkeyBag.test.isDivisible(reducedWorryLevel) ? 'true' : 'false'];
        const monkeyBagToThrowAt = monkeyNotes.get(monkeyIdToThrowAt);

        if (!monkeyBagToThrowAt) {
          throw new Error('impossiburu!');
        }

        monkeyBag.startingItems.shift();
        // reducedWorryLevel = reducedWorryLevel % lcm;
        monkeyBagToThrowAt.startingItems.push(reducedWorryLevel);
        manipulationsQuantityPerMonkey.set(monkeyId, manipulationsQuantityPerMonkey.get(monkeyId)! + 1);
      }
    }
  }

  const manipulationCountOfMostActive = [1, 1];

  for (const count of manipulationsQuantityPerMonkey.values()) {
    if (manipulationCountOfMostActive[0] < count) {
      manipulationCountOfMostActive[0] = count;
    } else if (manipulationCountOfMostActive[1] < count) {
      manipulationCountOfMostActive[1] = count;
    }
    manipulationCountOfMostActive.sort((a, b) => a - b);
  }

  return manipulationCountOfMostActive.reduce((acc, count) => acc * count, 1);
}

export function monkeyInTheMiddlePart2(monkeyNotes: MonkeyNotes, rounds: number, reduceWorryBy: number): number {
  const reduceWorry = (worry: number) => worry / reduceWorryBy;
  const manipulationsQuantityPerMonkey: Map<number, number> = new Map();
  for (const monkeyId of monkeyNotes.keys()) {
    manipulationsQuantityPerMonkey.set(monkeyId, 0);
  }

  // each rounds go monkey by monkey
  // monkey inspects item where number is worry level, one by one
  // worry level is processed by operation
  // test worry level and throw accordingly
  // monkey manipulated an item, so increment

  for (let round = 0; round < rounds; ++round) {
    for (const [monkeyId, monkeyBag] of monkeyNotes.entries()) {
      for (const itemWorryLevel of [...monkeyBag.startingItems]) {
        const newItemWorryLevel = monkeyBag.operation(itemWorryLevel);
        let reducedWorryLevel = reduceWorry(newItemWorryLevel);

        const monkeyIdToThrowAt = monkeyBag.test[monkeyBag.test.isDivisible(reducedWorryLevel) ? 'true' : 'false'];
        const monkeyBagToThrowAt = monkeyNotes.get(monkeyIdToThrowAt);

        if (!monkeyBagToThrowAt) {
          throw new Error('impossiburu!');
        }

        reducedWorryLevel = reducedWorryLevel % lcm;
        monkeyBag.startingItems.shift();
        monkeyBagToThrowAt.startingItems.push(reducedWorryLevel);
        manipulationsQuantityPerMonkey.set(monkeyId, manipulationsQuantityPerMonkey.get(monkeyId)! + 1);
      }
    }

    // let r = round + 1;
    // // if (r === 1 || r === 20 || r % 100 === 0) {
    // console.log(`=== Round ${round + 1} ===`);
    // for (const [monkeyId, monkeyBag] of monkeyNotes.entries()) {
    //   console.log(`Monkey ${monkeyId}: ${monkeyBag.startingItems.map(({ currentValue }) => currentValue).join(', ')}`);
    // }
    // console.log();
    // }
  }

  const manipulationCountOfMostActive = [1, 1];

  for (const count of manipulationsQuantityPerMonkey.values()) {
    if (manipulationCountOfMostActive[0] < count) {
      manipulationCountOfMostActive[0] = count;
    } else if (manipulationCountOfMostActive[1] < count) {
      manipulationCountOfMostActive[1] = count;
    }
    manipulationCountOfMostActive.sort((a, b) => a - b);
  }

  return manipulationCountOfMostActive.reduce((acc, count) => acc * count, 1);
}

// export function monkeyInTheMiddlePart2(monkeyNotes: MonkeyNotes, rounds: number, reduceWorryBy: number): void {
//   const reduceWorry = (worry: number) => worry / reduceWorryBy;
//   const manipulationsQuantityPerMonkey: Map<number, number> = new Map();
//   for (const monkeyId of monkeyNotes.keys()) {
//     manipulationsQuantityPerMonkey.set(monkeyId, 0);
//   }

//   // monkey
//   //  item
//   //    round
//   //      [x,x,x,x]: time item went into a monkey hand during a round
//   // so for example, number 79 takes 165 rounds to complete a full cycle, so item would have a length of 165
//   const itemLifetimes: Array<Array<Array<Array<number>>>> = [[], [], [], []];

//   for (const [monkeyId, monkeyBag] of monkeyNotes.entries()) {
//     for (const [i, item] of Object.entries(monkeyBag.startingItems)) {
//       const itemIndex = Number(i);
//       let nextMonkey = monkeyId;
//       let worry = item;
//       let rounds = 0;

//       do {
//         let formerMonkey = monkeyId;

//         while (nextMonkey >= formerMonkey) {
//           const nextMonkeyBag = monkeyNotes.get(nextMonkey)!;
//           worry = nextMonkeyBag.operation(worry);

//           if (!itemLifetimes[monkeyId][itemIndex]) {
//             itemLifetimes[monkeyId].push([]);
//           }
//           if (!itemLifetimes[monkeyId][itemIndex][rounds]) {
//             itemLifetimes[monkeyId][itemIndex].push([0, 0, 0, 0]);
//           }

//           itemLifetimes[monkeyId][itemIndex][rounds][nextMonkey] += 1;

//           formerMonkey = nextMonkey;
//           nextMonkey = nextMonkeyBag.test[nextMonkeyBag.test.isDivisible(worry) ? 'true' : 'false'];
//         }

//         ++rounds;

//         if (rounds === 20) {
//           break;
//         }
//       } while (worry % item !== 0 || nextMonkey !== monkeyId);
//     }
//   }

//   console.log(itemLifetimes[0][0].length);
// }

function testSomething() {
  const start = Number(60);
  const startBelongsTo = 2;

  let startCurrentlyAt = startBelongsTo;
  let worry = start;
  let rounds = 0;

  const monkeys = [
    {
      operation: (n: number) => n * 19,
      test: (n: number) => (n % 23 === 0 ? 2 : 3),
      manipulations: 0,
    },
    {
      operation: (n: number) => n + 6,
      test: (n: number) => (n % 19 === 0 ? 2 : 0),
      manipulations: 0,
    },
    {
      operation: (n: number) => n * n,
      test: (n: number) => (n % 13 === 0 ? 1 : 3),
      manipulations: 0,
    },
    {
      operation: (n: number) => n + 3,
      test: (n: number) => (n % 17 === 0 ? 0 : 1),
      manipulations: 0,
    },
  ];

  do {
    let formerMonkey = startCurrentlyAt;
    let nextMonkey = formerMonkey;

    while (nextMonkey >= formerMonkey) {
      const monkeyBag = monkeys[nextMonkey];
      worry = monkeyBag.operation(worry);
      monkeyBag.manipulations += 1;

      formerMonkey = nextMonkey;
      nextMonkey = monkeyBag.test(worry);
    }

    startCurrentlyAt = nextMonkey;
    ++rounds;

    // if (rounds === 20) {
    //   break;
    // }
  } while (worry % start !== 0 || startCurrentlyAt !== startBelongsTo);

  console.log(`ROUNDS: ${rounds}`);
  monkeys
    .map((m) => m.manipulations)
    .forEach((m, i) => {
      console.log(`Monkey ${i}: ${m}`);
    });
  console.log(`Final worry: ${worry}`);
}

// returns that 79 takes 165 rounds before finishing its cycle

export async function runDayEleven() {
  return [
    monkeyInTheMiddlePart1(await getMonkeyNotes('index.input.txt'), 20, 3),
    monkeyInTheMiddlePart2(await getMonkeyNotes('index.input.txt'), 10000, 1),
  ];
  // return [monkeyInTheMiddlePart2(monkeyNotes, 2, 3n)];
  // return [monkeyInTheMiddlePart2(monkeyNotes, 10000, 1)];
  // return testSomething();
}
