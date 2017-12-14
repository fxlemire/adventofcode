import { getHexHash } from '../10-knot-hash';

const getMap = async (input: string): Promise<string[]> => {
  const map = [];

  for (let i = 0; i < 128; ++i) {
    const key = `${input}-${i}`;
    const hash = await getHexHash(undefined, key);
    let bin = '';

    for (const char of hash) {
      let binary = parseInt(char, 16).toString(2);

      while (binary.length < 4) {
        binary = `0${binary}`;
      }

      bin += binary;
    }

    map.push(bin);
  }

  return map;
};

const getUsedSquares = async (input: string): Promise<number> => (await getMap(input))
  .reduce(
    (acc, cur) => {
      const totalOnes = cur.match(/1/g);

      return acc + (totalOnes && totalOnes.length);
    },
    0,
  );

const getAdjacentRegions = async (input: string, mapInput?: string[]): Promise<number> => {
  const map = (mapInput ? [...mapInput] : (await getMap(input))).map(str => str.replace(/1/g, '#').split(''));

  const propagateRegion = async (regionParam = 0, row = 0, column = 0, isMainThread = true): Promise<number> => {
    if (row < 0 || column < 0 || row >= map.length || column >= map[row].length) {
      return regionParam;
    }

    let region = regionParam;

    if (map[row][column] === '#') {
      if (isMainThread) {
        ++region;
      }

      map[row][column] = region.toString();

      await propagateRegion(region, row, column - 1, false);
      await propagateRegion(region, row, column + 1, false);
      await propagateRegion(region, row - 1, column, false);
      await propagateRegion(region, row + 1, column, false);
    }

    if (!isMainThread) {
      return;
    }

    const nextColumn = column + 1 >= map[row].length ? 0 : column + 1;
    const nextRow = nextColumn === 0 ? row + 1 : row;

    return propagateRegion(region, nextRow, nextColumn);
  };

  return propagateRegion();
};

(async function () {
  console.log(`Test should be 8108: ${await getUsedSquares('flqrgnkx')}`);
  console.log(`Result: ${await getUsedSquares('jxqlasbh')}`);
  const map = [
    '11010100',
    '01010101',
    '00001010',
    '10101101',
    '01101000',
    '11001000',
    '01000100',
    '11111110',
  ];
  console.log(`Test should be 9: ${await getAdjacentRegions('flqrgnkx', map)}`);
  console.log(`Test should be 1242: ${await getAdjacentRegions('flqrgnkx')}`);
  console.log(`Result: ${await getAdjacentRegions('jxqlasbh')}`);
})();
