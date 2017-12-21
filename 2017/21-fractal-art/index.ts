import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getRules = (file: string): Promise<Map<string, string>> => new Promise((res) => {
  const rules: Map<string,string> = new Map();
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/21-fractal-art/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    const [pattern, transform] = line.split(' => ');
    rules.set(pattern, transform);
  });

  rl.on('close', () => res(rules));
});

const flipHorizontally = (pattern: string[][]): string[][] => pattern.map(row => row.reverse());

const getXbyX = (grid: string[][], size: number): string[][][] => {
  const grids = [];
  const gridIterator = [...Array(grid.length / size).keys()].map(i => i * size);
  const sizeIterator = [...Array(size).keys()];

  for (const y of gridIterator) {
    for (const x of gridIterator) {
      const g = Array(size).fill(0).map(e => Array(size));

      for (const j of sizeIterator) {
        for (const i of sizeIterator) {
          g[j][i] = grid[y + j][i + x];
        }
      }

      grids.push(g);
    }
  }

  return grids;
};

const gridToLine = (grid: string[][]): string => grid.map(r => r.join('')).join('/');

const lineToGrid = (line: string): string[][] => line.split('/').map(r => r.split(''));

const rotate90clockwise = (pattern: string[][]): string[][] => {
  const rotated: string[][] = Array(pattern[0].length).fill(0).map(e => Array(pattern.length));

  for (let y = 0; y < pattern.length; ++y) {
    for (let x = 0; x < pattern[y].length; ++x) {
      rotated[x][pattern.length - 1 - y] = pattern[y][x];
    }
  }

  return rotated;
};

const getGridTransformed = (grid: string[][], rules: Map<string,string>): string[][] => {
  const rotationGrid: string[] = [];

  let gridLine = gridToLine(grid);
  rotationGrid.push(gridLine);

  let rotationIndex = 0;

  while (!rules.has(gridLine)) {

    if (rotationGrid.length < 4) {
      gridLine = gridToLine(rotate90clockwise(lineToGrid(rotationGrid[rotationGrid.length - 1])));
      rotationGrid.push(gridLine);
    } else if (rotationIndex < rotationGrid.length) {
      gridLine = gridToLine(flipHorizontally(lineToGrid(rotationGrid[rotationIndex++])));
    } else {
      throw new Error('No match found.');
    }
  }

  return lineToGrid(rules.get(gridLine));
};

const mergeGrids = (grids: string[][][]): string[][] => {
  const size = Math.sqrt(grids.length * grids[0].length * grids[0][0].length);
  const grid = Array(size).fill(0).map(e => Array(size));
  const gridIterator = [...Array(size / grids[0].length).keys()].map(i => i * grids[0].length); // 0.2.4
  const sizeIterator = [...Array(grids[0].length).keys()];

  let index = 0;
  for (const y of gridIterator) {
    for (const x of gridIterator) {
      const g = grids[index++];

      for (const j of sizeIterator) {
        for (const i of sizeIterator) {
          grid[y + j][x + i] = g[j][i];
        }
      }
    }
  }

  return grid;
};

const getPixelsTotalTurnedOn = async (file: string, iterations: number): Promise<number> => {
  const rules = await getRules(file);
  let grid = lineToGrid('.#./..#/###');
  let round = iterations;

  while (--round >= 0) {
    const newGrids: string[][][] = [];
    let size: number;

    if (grid.length % 2 === 0) {
      size = 2;
    } else if (grid.length % 3 === 0) {
      size = 3;
    } else {
      throw new Error('Grid should be divisible either by 2 or 3');
    }

    getXbyX(grid, size).forEach(g => newGrids.push(getGridTransformed(g, rules)));

    grid = mergeGrids(newGrids);
  }

  return grid.reduce((pixelsOn, row) => pixelsOn + row.filter(c => c === '#').length, 0);
};

(async function () {
  console.log(`Test should be 12: ${await getPixelsTotalTurnedOn('test', 2)}`);
  console.log(`Result: ${await getPixelsTotalTurnedOn('rules', 5)}`);
  console.log(`Result: ${await getPixelsTotalTurnedOn('rules', 18)}`);
})();
