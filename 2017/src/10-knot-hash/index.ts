import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getLengths = async (file: string, isPartTwo = false, input?: string): Promise<number[]> => {
  const lengths: number[] = [];

  const lineParser = (line: string) => {
    const l = line.trim();

    if (isPartTwo) {
      for (let i = 0; i < l.length; ++i) {
        lengths.push(l.charCodeAt(i));
      }
    } else {
      l.split(',').forEach((n) => { lengths.push(parseInt(n, 10)); });
    }
  };

  if (input) {
    lineParser(input);
    return isPartTwo ? [...lengths, 17, 31, 73, 47, 23] : lengths;
  }

  return new Promise<number[]>((res) => {
    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/10-knot-hash/${file}.txt`)),
    } as any);
    rl.on('line', lineParser);
    rl.on('close', () => res(isPartTwo ? [...lengths, 17, 31, 73, 47, 23] : lengths));
  });
};

const getSparseHash = async (file: string, isPartTwo = false, input?: string): Promise<number[]> => {
  const lengths = await getLengths(file, isPartTwo, input);
  const list = [...Array(file === 'test' ? 5 : file === 'test1b' ? 3 : 256).keys()];
  let position = 0;
  let skip = 0;
  let rounds = 0;

  while ((isPartTwo && rounds < 64) || (!isPartTwo && rounds < 1)) {
    lengths.forEach((length) => {
      const end = (position + length) <= list.length ? position + length : (position + length) % list.length;
      const reversed = (end > position ? list.slice(position, end) : [...list.slice(position, list.length + 1), ...list.slice(0, end)])
        .reverse();

      let revIndex = 0;

      if (length !== 0) {
        while (position !== end || revIndex === 0) {
          if (position >= list.length) {
            position = 0;
          }

          list[position++] = reversed[revIndex++];
        }
      }

      position += skip++;
      position %= list.length;
    });

    ++rounds;
  }

  return list;
};

const getPart1MultiplyResult = async (file: string): Promise<number> => {
  const list = await getSparseHash(file);

  return list[0] * list[1];
};

const getDenseHash = (sparse: number[], level = 16): number[] => {
  const dense = [];
  let i = 0;

  while (i <= sparse.length - level) {
    const sub = sparse.slice(i, i + level);

    dense.push(sub.reduce((acc, cur) => acc ^ cur, 0));

    i += level;
  }

  return dense;
};

export const getHexHash = async (file: string, input?: string): Promise<string> => {
  const list = await getSparseHash(file, true, input);
  const dense = getDenseHash(list);
  const hexDense = dense.map(n => `${n < 16 ? '0' : ''}${n.toString(16)}`);

  return hexDense.join('');
};

// tslint:disable-next-line no-unused-variable
const run = async () => {
  console.log(`Test should be 12: ${await getPart1MultiplyResult('test')}`);
  console.log(`Personal test should be 0: ${await getPart1MultiplyResult('test1b')}`);
  console.log(`Result: ${await getPart1MultiplyResult('knot')}`);
  console.log(`Result: ${await getHexHash('knot')}`);
};

// run();
