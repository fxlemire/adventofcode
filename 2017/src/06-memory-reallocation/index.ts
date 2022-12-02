import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getMemoryArray = async (file: string): Promise<number[]> => {
  return new Promise<number[]>((res) => {
    let memory: number[];
    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/06-memory-reallocation/${file}.txt`)),
    } as any);

    rl.on('line', (line: string) => memory = line.split(/\D/).map(n => parseInt(n, 10)));
    rl.on('close', () => res(memory));
  });
};

const distributeBlocksInPlace = (blocks: number[]): void => {
  const { max, maxIndex }: { max: number, maxIndex: number } = blocks.reduce(
    (acc, cur, i) => acc.max < cur ? { max: cur, maxIndex: i } : acc,
    { max: blocks[0], maxIndex: 0 });

  const remainder = max % blocks.length;
  const distributionAmount = (max - remainder) / blocks.length;
  let i = 0;

  do {
    const distanceFromMaxIndex = (i < maxIndex ? i + blocks.length : i) - maxIndex;
    const amount = distanceFromMaxIndex > 0 && distanceFromMaxIndex <= remainder ? distributionAmount + 1 : distributionAmount;
    blocks[i] = i === maxIndex ? amount : blocks[i] + amount;
  } while (++i < blocks.length);
};

const getInfiniteStep = async (file: string, isPartTwo = false): Promise<number> => {
  const storage = {};
  const blocks = await getMemoryArray(file);

  do {
    storage[blocks.join()] = true;
    distributeBlocksInPlace(blocks);
  } while (!storage[blocks.join()]);

  if (!isPartTwo) {
    return Object.keys(storage).length;
  }

  let steps = 0;
  const startingState = blocks.join();

  do {
    distributeBlocksInPlace(blocks);
    ++steps;
  } while (blocks.join() !== startingState);

  return steps;
};

(async function () {
  console.log(`Test should be 5: ${await getInfiniteStep('test')}`);
  console.log(`Part 1: ${await getInfiniteStep('memory')}`);
  console.log(`Test should be 4: ${await getInfiniteStep('test', true)}`);
  console.log(`Part 2: ${await getInfiniteStep('memory', true)}`);
})();
