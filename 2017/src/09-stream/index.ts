import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type SpecialCharacter = '{' | '}' | '<' | '>' | '!';

const getGroupScoreAndGarbage = async (file: string): Promise<{ score: number, garbage: number }> => {
  return new Promise<{ score: number, garbage: number }>((res) => {
    let score = 0;
    let garbage = 0;

    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/09-stream/${file}.txt`)),
    } as any);

    rl.on('line', (line: string) => {
      let level = 0;
      let isGarbage = false;

      for (let i = 0; i < line.length; ++i) {
        switch (line[i] as SpecialCharacter) {
          case '!':
            if (isGarbage) {
              ++i;
            }

            break;
          case '<':
            if (isGarbage) {
              ++garbage;
            }

            isGarbage = true;
            break;
          case '>':
            isGarbage = false;
            break;
          case '{':
            if (!isGarbage) {
              ++level;
            } else {
              ++garbage;
            }

            break;
          case '}':
            if (!isGarbage) {
              score += level--;
            } else {
              ++garbage;
            }

            break;
          default:
            if (isGarbage) {
              ++garbage;
            }

            break;
        }
      }
    });

    rl.on('close', () => res({ garbage, score }));
  });
};

(async function () {
  console.log(`Test should be 50: ${(await getGroupScoreAndGarbage('test')).score}`);
  console.log(`Result: ${(await getGroupScoreAndGarbage('stream')).score}`);
  console.log(`Test should be 32: ${(await getGroupScoreAndGarbage('test2')).garbage}`);
  console.log(`Result: ${(await getGroupScoreAndGarbage('stream')).garbage}`);
})();
