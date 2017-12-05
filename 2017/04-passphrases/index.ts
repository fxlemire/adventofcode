import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getValidPassphrases = async (file: string, isPartOne = true): Promise<number> => {
  return new Promise<number>((res) => {
    let totalValid = 0;

    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/04-passphrases/${file}.txt`)),
    } as any);

    const lineReader = (line: string, isPartOne: boolean) => {
      const wordSet = new Set();
      let words = line.split(' ');

      if (!isPartOne) {
        words = words.map(w => w.split('').sort().join(''));
      }

      for (const word of words) {
        if (wordSet.has(word)) {
          return;
        }

        wordSet.add(word);
      }

      ++totalValid;
    };

    rl.on('line', line => lineReader(line, isPartOne));
    rl.on('close', () => res(totalValid));
  });
};

(async function () {
  console.log(`Test should be 2: ${await getValidPassphrases('test-1')}`);
  console.log(`Result Part 1: ${await getValidPassphrases('passphrases')}`);
  console.log(`Test should be 3: ${await getValidPassphrases('test-2', false)}`);
  console.log(`Result Part 2: ${await getValidPassphrases('passphrases', false)}`);
})();
