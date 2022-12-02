import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getFirewall = (file: string): Promise<{layer: number, depth: number}[]> => new Promise((res) => {
  const firewall = [];
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/13-packet-scanners/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    const [layer, depth] = line.match(/\d+/g).map(n => parseInt(n, 10));

    firewall.push({ depth, layer });
  });

  rl.on('close', () => res(firewall));
});

const getSeverity = async (file: string, isPartTwo = false): Promise<{severity: number, delay: number}> => {
  const firewall = await getFirewall(file);
  let delay = 0;

  // need to use infinite loop as tail recursion cannot be optimized on Node and call stack is exceeded for this problem
  while (true) {
    let severity = 0;
    let round = 0;

    for (const { layer, depth } of firewall) {
      while (round < layer) {
        ++round;
      }

      const flattenedDepth = depth * 2 - 2;
      const flattenedPosition = (round + delay) % flattenedDepth;
      const scannerPosition = flattenedPosition >= depth ? flattenedDepth - flattenedPosition : flattenedPosition;
      const isCaught = scannerPosition === 0;

      if (isCaught) {
        severity += layer * depth;

        if (isPartTwo) {
          break;
        }
      }
    }

    if (!isPartTwo || (severity === 0 && round !== 0)) {
      return { delay, severity };
    }

    delay++;
  }
};

(async function () {
  console.log(`Test should be 24: ${(await getSeverity('test')).severity}`);
  console.log(`Result: ${(await getSeverity('firewall')).severity}`);
  console.log(`Test should be 10: ${(await getSeverity('test', true)).delay}`);
  console.log(`Result: ${(await getSeverity('firewall', true)).delay}`);
})();
