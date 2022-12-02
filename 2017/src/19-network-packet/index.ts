import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type Tile = '|' | '-' | '+';
type Direction = 'up' | 'down' | 'left' | 'right';

function isTile(tile: Tile | string): tile is Tile {
  let isTile = false;

  switch (tile) {
    case '+':
    case '-':
    case '|':
      isTile = true;
    default:
      break;
  }

  return isTile;
}

const getNetwork = (file: string): Promise<string[][]> => new Promise((res) => {
  const network: string[][] = [];
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/19-network-packet/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => network.push(line.split('')));
  rl.on('close', () => {
    const longest = network.reduce((acc, cur) => cur.length > acc ? cur.length : acc, 0);

    network.forEach((row) => {
      while (row.length < longest) {
        row.push(' ');
      }
    });

    res(network);
  });
});

/**
 * Returns x and y coordinates of starting character in the network
 *
 * @param {string[][]} network
 * @returns {[number, number]} [x, y], i.e. network[y][x]
 */
const findStartCoordinates = (network: string[][]): {coords: [number, number], direction: Direction} => {
  // top row
  let y = 0;
  let x = network[y].indexOf('|');

  if (x >= 0) {
    return { coords: [x, y], direction: 'down' };
  }

  // bottom row
  y = network.length - 1;
  x = network[y].indexOf('|');

  if (x >= 0) {
    return { coords: [x, y], direction: 'up' };
  }

  // first and last column
  for (y = 1; y < network.length - 1; ++y) {
    // first column
    x = 0;

    if (network[y][x] === '-') {
      return { coords: [x, y], direction: 'right' };
    }

    // last column
    x = network[y].length - 1;
    if (network[y][x] === '-') {
      return { coords: [x, y], direction: 'left' };
    }
  }

  throw new Error('No Starting Point Found.');
};

const getNextDirection = ([x, y]: number[], network: string[][], formerDirection: Direction): Direction => {
  switch (formerDirection) {
    case 'down':
    case 'up': {
      let xx = x - 1;

      if (xx >= 0 && network[y][xx] !== ' ' && network[y][xx] !== '|') {
        return 'left';
      }

      xx = x + 1;

      if (xx < network[y].length && network[y][xx] !== ' ' && network[y][xx] !== '|') {
        return 'right';
      }
    }
    case 'left':
    case 'right': {
      let yy = y + 1;

      if (yy < network.length && network[yy][x] !== ' ' && network[yy][x] !== '-') {
        return 'down';
      }

      yy = y - 1;

      if (yy >= 0 && network[yy][x] !== ' ' && network[yy][x] !== '-') {
        return 'up';
      }
    }
    default:
      throw new Error(`Invalid direction: ${formerDirection}`);
  }
};

const navigate = async (file: string): Promise<{encounters: string, steps: number}> => {
  const network = await getNetwork(file);
  let { coords: [x, y], direction } = findStartCoordinates(network);
  let encounters = '';
  let steps = 0;

  while (direction && network[y][x] !== ' ') {

    switch (direction) {
      case 'down': {
        ++y;
        break;
      }
      case 'left': {
        --x;
        break;
      }
      case 'right': {
        ++x;
        break;
      }
      case 'up': {
        --y;
        break;
      }
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }

    if (network[y][x] as Tile === '+') {
      direction = getNextDirection([x, y], network, direction);
    } else if (!isTile(network[y][x]) && network[y][x] !== ' ') {
      encounters += network[y][x];
    }

    ++steps;
  }

  return { encounters, steps };
};

(async function () {
  console.log(`Test should be 'ABCDEF': ${(await navigate('test')).encounters}`);
  console.log(`Result: ${(await navigate('network')).encounters}`);
  console.log(`Test should be 38: ${(await navigate('test')).steps}`);
  console.log(`Result: ${(await navigate('network')).steps}`);
})();
