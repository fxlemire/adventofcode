import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type Direction = 'up' | 'down' | 'left' | 'right';
type GridStatus = Boolean | 'W' | 'F';

const getGrid = (file: string): Promise<Map<string, GridStatus>> => new Promise((res) => {
  const initialGrid: string[][] = [];
  const grid: Map<string,boolean> = new Map();
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/22-sporifica-virus/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => initialGrid.push(line.split('')));

  rl.on('close', () => {
    if (initialGrid.length % 2 === 0 || initialGrid.length !== initialGrid[0].length) {
      throw new Error('Invalid starting grid. Must be square and have sides with an odd length');
    }

    const middle = (initialGrid.length - 1) / 2;

    for (let y = 0; y < initialGrid.length; ++y) {
      for (let x = 0; x < initialGrid.length; ++x) {
        const index = `${x - middle},${middle - y}`;

        grid.set(index, initialGrid[y][x] === '#');
      }
    }

    res(grid);
  });
});

const getTurn = (turn: Direction | 'opposite', currentFacing: Direction): Direction => {
  if (turn === 'down' || turn === 'up') {
    throw new Error('Can only turn left or right');
  }

  switch (currentFacing) {
    case 'down':
      return turn === 'left' ? 'right'
        : turn === 'right' ? 'left' : 'up';
    case 'left':
      return turn === 'left' ? 'down'
        : turn === 'right' ? 'up' : 'right';
    case 'right':
      return turn === 'left' ? 'up'
        : turn === 'right' ? 'down' : 'left';
    case 'up':
      return turn === 'left' ? 'left'
      : turn === 'right' ? 'right' : 'down';
    default:
      throw new Error(`Invalid direction: ${currentFacing}`);
  }
};

const moveForward = (position: [number, number], direction: Direction): void => {
  switch (direction) {
    case 'down':
      --position[1];
      break;
    case 'left':
      --position[0];
      break;
    case 'right':
      ++position[0];
      break;
    case 'up':
      ++position[1];
      break;
  }
};

const getInfectionBursts = async (file: string, iterations: number, isPartOne = true): Promise<number> => {
  const grid = await getGrid(file);
  let infectionBursts = 0;
  let rounds = iterations;
  const position: [number, number] = [0, 0];
  let direction: Direction = 'up';

  const partOneLogic = (index: string) => {
    if (grid.get(index)) {
      direction = getTurn('right', direction);
      grid.set(index, false);
    } else {
      direction = getTurn('left', direction);
      grid.set(index, true);
      ++infectionBursts;
    }
  };

  const partTwoLogic = (index: string) => {
    switch (grid.get(index)) {
      case true:
        direction = getTurn('right', direction);
        grid.set(index, 'F');
        break;
      case 'F':
        direction = getTurn('opposite', direction);
        grid.set(index, false);
        break;
      case 'W':
        grid.set(index, true);
        ++infectionBursts;
        break;
      case false:
      default:
        direction = getTurn('left', direction);
        grid.set(index, 'W');
        break;
    }
  };

  while (--rounds >= 0) {
    const index = position.join(',');
    isPartOne ? partOneLogic(index) : partTwoLogic(index);
    moveForward(position, direction);
  }

  return infectionBursts;
};

(async function () {
  console.log(`Test should be 5: ${await getInfectionBursts('test', 7)}`);
  console.log(`Test should be 41: ${await getInfectionBursts('test', 70)}`);
  console.log(`Test should be 5587: ${await getInfectionBursts('test', 10000)}`);
  console.log(`Result: ${await getInfectionBursts('grid', 10000)}`);
  console.log(`Test should be 26: ${await getInfectionBursts('test', 100, false)}`);
  console.log(`Test should be 2511944: ${await getInfectionBursts('test', 10000000, false)}`);
  console.log(`Result: ${await getInfectionBursts('grid', 10000000, false)}`);
})();
