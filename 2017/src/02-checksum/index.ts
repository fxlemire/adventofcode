import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const printChecksum = async (file: string, isPartOne = true): Promise<number> => {
  return new Promise<number>((res) => {
    let checksum = 0;

    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/02-checksum/${file}.txt`)),
    } as any);

    const lineReaderOne = (line: string) => {
      const numbers = line.split(/\D/);
      let min = parseInt(numbers[0], 10);
      let max = parseInt(numbers[0], 10);

      numbers.forEach((numString) => {
        const num = parseInt(numString, 10);

        if (num < min) {
          min = num;
        } else if (num > max) {
          max = num;
        }
      });

      checksum += max - min;
    };

    const lineReaderTwo = (line: string) => {
      const numbers = line.split(/\D/).map(n => parseInt(n, 10));

      for (let i = 0; i < numbers.length; ++i) {
        const num = numbers[i];
        let nextIndex = i + 1;
        let isFound = false;

        while (nextIndex < numbers.length) {
          let max;
          let min;

          if (num <= numbers[nextIndex]) {
            max = numbers[nextIndex];
            min = num;
          } else {
            max = num;
            min = numbers[nextIndex];
          }

          if (max % min === 0) {
            checksum += max / min;
            isFound = true;
            break;
          }

          ++nextIndex;
        }

        if (isFound) {
          break;
        }
      }
    };

    rl.on('line', isPartOne ? lineReaderOne : lineReaderTwo);
    rl.on('close', () => res(checksum));
  });
};

(async function () {
  console.log(`Test should be 18: ${await printChecksum('test-1')}`);
  console.log(`Result Part 1: ${await printChecksum('checksum')}`);
  console.log(`Test should be 9: ${await printChecksum('test-2', false)}`);
  console.log(`Result Part 2: ${await printChecksum('checksum', false)}`);
})();
