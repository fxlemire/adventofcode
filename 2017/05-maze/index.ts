import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getMazeArray = async (file: string): Promise<number[]> => {
  return new Promise<number[]>((res) => {
    const maze: number[] = [];
    const rl = createInterface({
      crlfDelay: global.Infinity,
      input: createReadStream(resolve(__dirname, `../../resources/05-maze/${file}.txt`)),
    } as any);
    rl.on('line', (line: string) => maze.push(parseInt(line.trim(), 10)));
    rl.on('close', () => res(maze));
  });
};

const getStepsToExit = (m: number[], isPartTwo = true): number => {
  const maze = [...m];

  let steps = 0;
  let index = 0;

  while (index < maze.length) {
    index += isPartTwo && maze[index] >= 3 ? maze[index]-- : maze[index]++;
    ++steps;
  }

  return steps;
};

(async function () {
  let maze = await getMazeArray('test');
  console.log(`Test should be 5: ${getStepsToExit(maze, false)}`);
  console.log(`Test should be 10: ${getStepsToExit(maze)}`);

  maze = await getMazeArray('maze');
  console.log(`Part 1: ${getStepsToExit(maze, false)}`);
  console.log(`Part 2: ${getStepsToExit(maze)}`);
})();
