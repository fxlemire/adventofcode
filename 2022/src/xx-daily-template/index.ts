import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

export async function getXXX(filename: string): Promise<Array<string>> {
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, filename)),
  });

  const lineReader = (line: string): void => {};

  rl.on('line', lineReader);

  return new Promise((res) => {
    rl.on('close', () => {
      res(['']);
    });
  });
}

export function xxxPart1(input: Array<string>): number {
  return 0;
}
export function xxxPart2(input: Array<string>): number {
  return 0;
}

export async function runDayXX() {
  const xxx = await getXXX('index.input.txt');
  return [xxxPart1(xxx), xxxPart2(xxx)];
}
