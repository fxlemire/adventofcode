import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type RegisterResponse = {
  highestValue: number;
  registers: Register;
};

type Register = {
  [key: string]: number;
};

type Comparator = '<' | '<=' | '>' | '>=' | '==' | '!=';
type Modificator = 'inc' | 'dec';

const getRegisters = async (file: string): Promise<RegisterResponse> => {
  return new Promise<RegisterResponse>((res) => {
    let highestValue = 0;
    const registers: Register = {};

    const getStatementValidity = (registers: Register, regCompared: string, comparator: Comparator, value: number): boolean => {
      switch (comparator) {
        case '!=':
          return registers[regCompared] !== value;
        case '<':
          return registers[regCompared] < value;
        case '<=':
          return registers[regCompared] <= value;
        case '==':
          return registers[regCompared] === value;
        case '>':
          return registers[regCompared] > value;
        case '>=':
          return registers[regCompared] >= value;
        default:
          throw new Error('Invalid Comparator');
      }
    };

    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/08-registers/${file}.txt`)),
    } as any);

    rl.on('line', (line: string) => {
      const [reg, mod, amountStr, ifword, regCompared, comparator, valueStr] = line.match(/\S+/g);
      const modAmount = parseInt(amountStr, 10);
      const compareValue = parseInt(valueStr, 10);

      registers[reg] = registers[reg] || 0;
      registers[regCompared] = registers[regCompared] || 0;

      const isTrue = getStatementValidity(registers, regCompared, comparator as Comparator, compareValue);

      if (isTrue) {
        switch (mod as Modificator) {
          case 'dec':
            registers[reg] = registers[reg] - modAmount;
            break;
          case 'inc':
            registers[reg] = registers[reg] + modAmount;
            break;
        }

        if (registers[reg] > highestValue) {
          highestValue = registers[reg];
        }
      }
    });

    rl.on('close', () => res({ highestValue, registers }));
  });
};

const getLargestValue = async (registers: Register): Promise<number> => {
  const registerKeys = Object.keys(registers);

  return registerKeys.reduce((acc, cur) => acc > registers[cur] ? acc : registers[cur], registers[registerKeys[0]]);
};

(async function () {
  const testRegisters = await getRegisters('test');
  const registers = await getRegisters('registers');

  console.log(`Test should be 1: ${await getLargestValue(testRegisters.registers)}`);
  console.log(`Result: ${await getLargestValue(registers.registers)}`);
  console.log(`Test highest value should be 10: ${testRegisters.highestValue}`);
  console.log(`Highest value: ${registers.highestValue}`);
})();
