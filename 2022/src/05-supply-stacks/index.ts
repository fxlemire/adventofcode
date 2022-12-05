import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

export type StackUnloadingInstructions = {
  stacks: Array<Array<string>>;
  instructions: Array<Array<number>>;
};

export async function getStackUnloadingInstructions(filename: string): Promise<StackUnloadingInstructions> {
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, filename)),
  });

  const stacks: Array<Array<string>> = [];
  const instructions: Array<Array<number>> = [];
  let fileLine = 0;

  const lineReader = (line: string): void => {
    if (line.includes('[')) {
      for (let i = 1; i < line.length - 1; i += 4) {
        const columnIndex = Math.floor(i / 4);
        const crate = line.at(i);

        if (crate && crate !== ' ') {
          if (!stacks[columnIndex]) {
            stacks[columnIndex] = [];
          }

          stacks[columnIndex].push(crate);
        }
      }
    } else if (line.startsWith('move')) {
      const moves = line.match(/[0-9][0-9]?/g);

      if (!moves || moves.length !== 3) {
        throw new Error('impossiburu!');
      }

      instructions.push(moves.map(Number));
    }

    ++fileLine;
  };

  rl.on('line', lineReader);

  return new Promise((res) => {
    rl.on('close', () => {
      res({ stacks: stacks.map((stack) => stack.reverse()), instructions });
    });
  });
}

function getTopCrates(stacks: Array<Array<string>>) {
  return stacks.reduce((acc, stack) => (stack[stack.length - 1] ? acc + stack[stack.length - 1] : acc), '');
}

export function supplyStacksPart1({ instructions, stacks }: StackUnloadingInstructions): string {
  for (const [m, f, t] of instructions) {
    let move = m;
    const from = f - 1;
    const to = t - 1;

    for (move; move > 0; --move) {
      const crate = stacks[from].pop();

      if (!crate) {
        continue;
      }

      stacks[to].push(crate);
    }
  }

  return getTopCrates(stacks);
}

export function supplyStacksPart2({ instructions, stacks }: StackUnloadingInstructions): string {
  for (const [m, f, t] of instructions) {
    let move = m;
    const from = f - 1;
    const to = t - 1;

    const crates = stacks[from].splice(stacks[from].length - move);

    stacks[to].push(...crates);
  }

  return getTopCrates(stacks);
}

export async function runDayFive() {
  return [
    supplyStacksPart1(await getStackUnloadingInstructions('index.input.txt')),
    supplyStacksPart2(await getStackUnloadingInstructions('index.input.txt')),
  ];
}
