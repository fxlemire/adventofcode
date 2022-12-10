import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type AddX = ['addx', number];
type Noop = ['noop'];
type Operations = Array<AddX | Noop>;
type CycleAndValue = [number, number];

type RELEVANT_CYCLE = typeof RELEVANT_CYCLES[number];
const RELEVANT_CYCLES = [20, 60, 100, 140, 180, 220] as const;
export type SignalStrengths = { [key in typeof RELEVANT_CYCLES[number]]: number } & { total: number };

function isRelevantCycle(cycle: number): cycle is RELEVANT_CYCLE {
  return RELEVANT_CYCLES.includes(cycle as RELEVANT_CYCLE);
}

export async function getOperations(filename: string): Promise<Operations> {
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, filename)),
  });

  const operations: Operations = [];

  const lineReader = (line: string): void => {
    const [operation, value] = line.split(' ');

    if (operation === 'noop') {
      operations.push([operation]);
    } else if (operation === 'addx') {
      operations.push([operation, Number(value)]);
    } else {
      throw new Error('impossiburu!');
    }
  };

  rl.on('line', lineReader);

  return new Promise((res) => {
    rl.on('close', () => {
      res(operations);
    });
  });
}

/**
 * @param operations
 * @returns An array of tuples where the first element is the quantity of cycles needed before the value (second element) may be consumed.
 */
function getQueueOfCycleAndValue(operations: Operations): Array<CycleAndValue> {
  return operations.map(([op, v]) => (op === 'noop' ? [1, 0] : [2, v]));
}

function tickCpu(cycleAndValueQueue: Array<CycleAndValue>): number {
  const cycleAndValue = cycleAndValueQueue[0];
  let value = 0;

  if (cycleAndValue !== undefined && --cycleAndValue[0] <= 0) {
    value = cycleAndValue[1];
    cycleAndValueQueue.shift();
  }

  return value;
}

function validateSignalStrengths(signalStrengths: Partial<SignalStrengths>): signalStrengths is SignalStrengths {
  for (const cycle of RELEVANT_CYCLES) {
    if (!(cycle in signalStrengths)) {
      throw new Error(`Missing a cycle in signal strengths return value.: ${cycle}`);
    }
  }

  return true;
}

export function cathodeRayTubePart1(operations: Operations): SignalStrengths {
  const cycleAndValueQueue = getQueueOfCycleAndValue(operations);
  const signalStrengths: Partial<SignalStrengths> = {};
  let X = 1;

  for (let cycle = 0; cycle < Math.max(...RELEVANT_CYCLES); ++cycle) {
    const potentiallyRelevantCycle = cycle + 1;

    if (isRelevantCycle(potentiallyRelevantCycle)) {
      signalStrengths[potentiallyRelevantCycle] = X * potentiallyRelevantCycle;
    }

    X += tickCpu(cycleAndValueQueue);
  }

  signalStrengths['total'] = Object.values(signalStrengths).reduce((acc, v) => acc + v, 0);

  if (!validateSignalStrengths(signalStrengths)) {
    throw new Error();
  }

  return signalStrengths;
}

export function cathodeRayTubePart2(operations: Operations): Array<string> {
  const LIT_PIXEL = '#';
  const DARK_PIXEL = '.';
  const pixels = Array.from({ length: 6 }).map((row) => Array.from<string>({ length: 40 }).fill('.'));
  let X = 1;
  const cycleAndValueQueue = getQueueOfCycleAndValue(operations);

  pixels.forEach((row) => {
    row.forEach((_, index) => {
      if (index >= X - 1 && index <= X + 1) {
        row[index] = LIT_PIXEL;
      }

      X += tickCpu(cycleAndValueQueue);
    });
  });

  return pixels.map((row) => row.join(''));
}

export async function runDayTen() {
  const operations = await getOperations('index.input.txt');

  return [cathodeRayTubePart1(operations).total, cathodeRayTubePart2(operations)] as const;
}
