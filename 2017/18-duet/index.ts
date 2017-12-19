import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type Instruction = {
  action: 'snd' | 'set' | 'add' | 'mul' | 'mod' | 'rcv' | 'jgz';
  args: (string|number)[];
};

const getInstructions = (file: string): Promise<{registers: {[key: string]: number}, instructions: Instruction[]}> => new Promise((res) => {
  const registers = {};
  const instructions: Instruction[] = [];
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/18-duet/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    const [action, arg1, arg2] = line.split(' ');
    const a1 = parseInt(arg1, 10) || arg1;
    const a2 = parseInt(arg2, 10) || arg2;
    const instruction: Instruction = {
      action: action as Instruction['action'],
      args: [a1, a2],
    };

    if (typeof a1 === 'string') {
      registers[a1] = 0;
    }

    if (typeof a2 === 'string') {
      registers[a2] = 0;
    }

    instructions.push(instruction);
  });

  rl.on('close', () => res({ registers, instructions }));
});

const getFirstRecoveredFrequency = async (file: string): Promise<number> => {
  const { registers, instructions } = await getInstructions(file);
  const getValue = (a: string|number): number => (Number.isInteger(a as number) ? a : registers[a]) as number;
  let isRecovered = false;
  let lastFrequencyPlayed = 0;

  for (let i = 0; i >= 0 && i < instructions.length && !isRecovered; ++i) {
    const instruction = instructions[i];

    switch (instruction.action) {
      case 'add': {
        registers[instruction.args[0]] += getValue(instruction.args[1]);
        break;
      }
      case 'jgz': {
        const regValue = getValue(instruction.args[0]);

        if (regValue > 0) {
          i += (getValue(instruction.args[1]) - 1);
        }

        break;
      }
      case 'mod': {
        registers[instruction.args[0]] %= getValue(instruction.args[1]);
        break;
      }
      case 'mul': {
        registers[instruction.args[0]] *= getValue(instruction.args[1]);
        break;
      }
      case 'rcv': {
        if (getValue(instruction.args[1]) !== 0) {
          isRecovered = true;
        }

        break;
      }
      case 'set': {
        registers[instruction.args[0]] = getValue(instruction.args[1]);
        break;
      }
      case 'snd': {
        lastFrequencyPlayed = getValue(instruction.args[0]);
        break;
      }
      default:
        throw new Error('Invalid instruction');
    }
  }

  return lastFrequencyPlayed;
};

(async function () {
  console.log(`Test should be 4: ${await getFirstRecoveredFrequency('test')}`);
  console.log(`Result: ${await getFirstRecoveredFrequency('duet')}`);
})();
