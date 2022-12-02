/**
 * logic: imagine a grid like [rootfolder]/resources/11-hex-grid/test-image.png where:
 *  the x axis is standard
 *  the y axis can have 0.5 values
 * part1:
 *  increment x and y according to the direction (see `getFinalAndAllStops`)
 *  until you either cross the 'x' axis or the 'y' axis (by an off-by-0.5 margin), move towards the point in the proper diagonal
 *  then add remaining difference in steps with the straight difference of tiles (difference of either both points 'x' or 'y')
 * part2:
 *  although i could pass my own tests, the solution did not work on the website so this is a brute force approach
 *  store every tile coordinates that has been touched and calculate the steps needed to reach it. keep the highest one
 *  past attempt: only keep the coordinates where absolute values of both x and y are the highest and calculate the steps
 *
 * better approach: see https://www.redblobgames.com/grids/hexagons/#distances
 *  the hexagon tile can be represented as a cube (https://www.redblobgames.com/grids/hexagons/#coordinates-cube)
 *  simply need to return (abs(a.x) + abs(a.y) + abs(a.z)) / 2 after each computation
 */
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type Direction = 'n' | 'ne' | 'se' | 's' | 'sw' | 'nw';

const getDirections = (file: string): Promise<Direction[]> => new Promise((res) => {
  let directions: Direction[];

  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/11-hex-grid/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => directions = line.split(',') as Direction[]);

  rl.on('close', () => res(directions));
});

const getFinalAndAllStops = (directions: Direction[]): {allStops: {x: number, y: number}[], final: {x: number, y: number}} => {
  const final = { x: 0, y: 0 };
  const allStops = [];

  directions.forEach((direction) => {
    switch (direction) {
      case 'n':
        ++final.y;
        break;
      case 'ne':
        ++final.x;
        final.y += 0.5;
        break;
      case 'se':
        ++final.x;
        final.y -= 0.5;
        break;
      case 's':
        --final.y;
        break;
      case 'sw':
        --final.x;
        final.y -= 0.5;
        break;
      case 'nw':
        --final.x;
        final.y += 0.5;
        break;
      default:
        throw new Error('Invalid direction');
    }

    allStops.push({ ...final });
  });

  return { allStops, final };
};

const getShortestSteps = async (file: string, testDirections?: Direction[]): Promise<{furthest: number, steps: number}> => {
  const directions = testDirections || await getDirections(file);
  const { allStops, final } = getFinalAndAllStops(directions);
  const getStepsToTile = (x: number, y: number): number => {
    let steps = 0;
    let curX = 0;
    let curY = 0;

    const modX = x < 0 ? -1 : 1;
    const modY = y < 0 ? -0.5 : 0.5;

    while (curX !== x && Math.abs(y - curY) > 0.5) {
      curX += modX;
      curY += modY;
      ++steps;
    }

    steps += x === curX ? Math.abs(y - curY) : Math.abs(x - curX);

    return steps;
  };

  const furthestDist = allStops.reduce(
    (acc, cur) => {
      const distance = getStepsToTile(cur.x, cur.y);

      return distance > acc ? distance : acc;
    },
    0,
  );

  return { furthest: furthestDist, steps: getStepsToTile(final.x, final.y) };
};

(async function () {
  const test1: Direction[] = ['nw', 'ne', 'ne', 's', 'ne', 'n', 'nw', 's', 's', 's', 'sw', 'nw', 'ne', 'nw', 'sw', 'se'];
  const test2: Direction[] = ['n', 'nw', 'nw', 'n', 'sw', 'nw', 'nw', 's', 'nw', 's', 's', 'ne'];
  const test3: Direction[] = ['n', 's', 'n', 'ne', 'ne', 'nw', 'n', 'sw'];
  const test4: Direction[] = [
    's', 'sw', 's', 'ne', 'se', 'ne', 'ne', 'ne', 'ne', 'se', 'ne', 'n', 'n', 'sw', 'n', 'n', 'n', 'sw', 'n', 'nw', 'nw', 's',
  ];
  const test5: Direction[] = ['se', 'se', 'n', 'n', 'se', 'n', 'se', 'ne', 'ne', 's', 's', 'se', 'sw', 'n'];
  const test6: Direction[] = ['sw', 's', 'sw', 's', 'sw', 'sw', 'sw', 's', 'se', 'ne', 'ne', 'n', 'ne', 'ne'];

  const test1Result = await getShortestSteps(undefined, test1);
  const test2Result = await getShortestSteps(undefined, test2);
  const test3Result = await getShortestSteps(undefined, test3);
  const test4Result = await getShortestSteps(undefined, test4);
  const test5Result = await getShortestSteps(undefined, test5);
  const test6Result = await getShortestSteps(undefined, test6);
  const result = await getShortestSteps('path');

  console.log(`Test1 should be: steps 1: ${test1Result.steps} furthest 3: ${test1Result.furthest}`);
  console.log(`Test2 should be: steps 5: ${test2Result.steps} furthest 6: ${test2Result.furthest}`);
  console.log(`Test3 should be: steps 3: ${test3Result.steps} furthest 4: ${test3Result.furthest}`);
  console.log(`Test4 should be: steps 6: ${test4Result.steps} furthest 7: ${test4Result.furthest}`);
  console.log(`Test5 should be: steps 6: ${test5Result.steps} furthest 7: ${test5Result.furthest}`);
  console.log(`Test6 should be: steps 3: ${test6Result.steps} furthest 8: ${test6Result.furthest}`);
  console.log(`Result: steps: ${result.steps} furthest: ${result.furthest}`);
})();
