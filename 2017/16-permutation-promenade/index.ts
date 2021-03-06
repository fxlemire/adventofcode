import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type DanceMove = {
  move: 's' | 'x' | 'p';
  args: (string|number)[];
};

const getDanceMoves = (file: string): Promise<DanceMove[]> => new Promise((res) => {
  const danceMoves: DanceMove[] = [];
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/16-permutation-promenade/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    line.split(',').forEach((dance: string) => {
      const move = dance[0] as DanceMove['move'];
      const [, arg1, arg2] = move === 's' ? [, dance.substr(1), undefined] : dance.substr(1).match(/(.+)\/(.+)/);
      const danceMove: DanceMove = {
        move,
        args: move === 'p' ? [arg1, arg2] : [parseInt(arg1, 10), parseInt(arg2, 10)],
      };

      danceMoves.push(danceMove);
    });
  });

  rl.on('close', () => res(danceMoves));
});

const getAnswer = async (file: string, programs: string, rounds = 1): Promise<string> => {
  let prog = programs.split('');
  const danceMoves = await getDanceMoves(file);
  let r = rounds;
  let totalDanceSteps = -1;

  const dance = (rounds: number, isFindingCycle = true, stepsToDance = danceMoves.length): void => {
    while (--r >= 0) {
      for (let danceIndex = 0; danceIndex < danceMoves.length; ++danceIndex) {
        const dance = danceMoves[danceIndex];

        switch (dance.move) {
          case 's': {
            const steps = dance.args[0] as number;
            const tempProg = [];

            for (let i = 0; i < prog.length; ++i) {
              tempProg[(i + steps) % prog.length] = prog[i];
            }

            prog = tempProg;

            break;
          }
          case 'x': {
            const pos1name = prog[dance.args[0]];
            const pos2name = prog[dance.args[1]];

            prog[dance.args[0]] = pos2name;
            prog[dance.args[1]] = pos1name;

            break;
          }
          case 'p': {
            let p1Index;
            let p2Index;

            for (let i = 0; i < prog.length; ++i) {
              if (prog[i] === dance.args[0]) {
                p1Index = i;
              }

              if (prog[i] === dance.args[1]) {
                p2Index = i;
              }

              if (p1Index && p2Index) {
                break;
              }
            }

            prog[p1Index] = dance.args[1] as string;
            prog[p2Index] = dance.args[0] as string;

            break;
          }
          default:
            throw new Error('Invalid move');
        }

        if (isFindingCycle && prog.join('') === programs) {
          totalDanceSteps = (rounds - 1 - r) * danceMoves.length + danceIndex + 1;
          break;
        }
      }

      if (isFindingCycle && totalDanceSteps > -1) {
        break;
      }
    }
  };

  // first dance finds a cycle and sets totalDanceSteps
  dance(r);

  // remove cycles to get total steps that actually need to be danced
  let stepsToDance = rounds * danceMoves.length % totalDanceSteps;
  r = Math.floor(stepsToDance / danceMoves.length);
  stepsToDance %= r;

  dance(r, false, stepsToDance);

  return prog.join('');
};

(async function () {
  const prog = 'abcdefghijklmnop';
  const test = 'abcde';
  console.log(`Test should be 'baedc': ${await getAnswer('test', test)}`);
  console.log(`Result: ${await getAnswer('dance', prog)}`);
  console.log(`Test should be 'ceadb': ${await getAnswer('test', test, 2)}`);
  console.log(`Result: ${await getAnswer('dance', prog, 1000000000)}`);
})();
