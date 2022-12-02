import { createCanvas } from 'canvas';
import { createWriteStream } from 'fs';
import * as GifEncoder from 'gifencoder';
import { resolve } from 'path';
import { getHexHash } from '../10-knot-hash';

const getRandomInt = (min = 0, max = 255): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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

const getAdjacentRegions = async (input: string, mapInput?: string[], gifScale?: number): Promise<number> => {
  const regionColors: {[key: string]: [number, number, number]} = {
    '#': [255, 255, 255],
    0: [255, 255, 255],
  };
  const getColor = (region: string): [number, number, number] => {
    let rgb;

    if (regionColors[region]) {
      rgb = regionColors[region];
    } else {
      rgb = [getRandomInt(), getRandomInt(), getRandomInt()];
      regionColors[region] = rgb;
    }

    return rgb;
  };

  const map = (mapInput ? [...mapInput] : (await getMap(input))).map(str => str.replace(/1/g, '#').split(''));
  const gifSize = gifScale && map.length * gifScale;
  const encoder = gifScale && new GifEncoder(gifSize, gifSize);
  const canvas = gifScale && createCanvas(gifSize, gifSize);
  const ctx = gifScale && canvas.getContext('2d');
  const mapImage = gifScale && new Uint8ClampedArray(((gifSize) ** 2) * 4);

  if (gifScale) {
    for (let i = 0; i < mapImage.length; ++i) {
      mapImage[i] = 255;
    }

    encoder.createReadStream().pipe(createWriteStream(resolve(__dirname, `../../resources/14-disk-defragmentation/defrag.gif`)));
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1);
  }

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

      if (gifScale) {
        const [r, g, b] = getColor(region.toString());

        for (let y = 0; y < gifScale; ++y) {
          for (let x = 0; x < 4 * gifScale; x += 4) {
            const initialOffset = gifSize * 4 * row;
            const columnOffset = (row * gifSize + column * gifScale) * 4 + x;
            const rowOffset = y * gifSize * 4;
            const position = initialOffset + columnOffset + rowOffset;

            mapImage[position + 0] = r;
            mapImage[position + 1] = g;
            mapImage[position + 2] = b;
            mapImage[position + 3] = 255;
          }
        }

        const idata = ctx.createImageData(gifSize, gifSize);
        idata.data.set(mapImage);
        ctx.putImageData(idata, 0, 0);
        encoder.addFrame(ctx);
      }

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
  console.log(`Result: ${await getAdjacentRegions('jxqlasbh', undefined, 1)}`);
})();
