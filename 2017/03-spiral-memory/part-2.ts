/* logic:
 * generate an object where the keys are the cartesian coordinates which maps to the value at the coordinates
 * e.g. { x_y: value } ==> { '-1_-2': 22 }
 * for each layer, create an array of the coordinates e.g. [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1], [1,-1]]
 * for each coordinate, get the sum of their surrounding coordinates that have been created so far
 * add to the global object and check if value is greater than input, if not move to the next layer when layer is complete
 */

(function () {
  const values: {[xy: string]: number} = {
    '0_0': 1,
  };

  const getLayerCoordinates = (layer: number): [number, number][] => {
    const positions = [];
    let x = layer;
    let y = 0 - (layer - 1);

    positions.push([x, y]);

    while (y < layer) {
      positions.push([x, ++y]);
    }

    while (x > (0 - layer)) {
      positions.push([--x, y]);
    }

    while (y > (0 - layer)) {
      positions.push([x, --y]);
    }

    while (x < layer) {
      positions.push([++x, y]);
    }

    return positions;
  };

  const getSurroundingSum = (x: number, y: number): number => {
    const surroundingKeys = [
      [x - 1, y + 1],
      [x - 1, y],
      [x - 1, y - 1],
      [x , y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
    ].map(pair => pair.join('_'));

    return surroundingKeys.reduce((acc, key) => values[key] ? acc + values[key] : acc, 0);
  };

  const findFirstLargerValue = (puzzleInput: number, position = 2, layer = 1): number => {
    if (position > puzzleInput) {
      console.error('Could not find value larger than puzzle input.');
      return;
    }

    const layerPositions = getLayerCoordinates(layer);

    for (const [x, y] of layerPositions) {
      const cur = getSurroundingSum(x, y);
      values[`${x}_${y}`] = cur;

      if (cur > puzzleInput) {
        return cur;
      }
    }

    return findFirstLargerValue(puzzleInput, position + layerPositions.length, layer + 1);
  };

  const firstLargerValue = findFirstLargerValue(277678);

  console.log(`1: ${values['1_0']}`);
  console.log(`5: ${values['-1_1']}`);
  console.log(`26: ${values['2_-1']}`);
  console.log(`122: ${values['1_2']}`);
  console.log(`362: ${values['-2_-2']}`);
  console.log(`806: ${values['0_-2']}`);
  console.log(`first larger value: ${firstLargerValue}`);
})();
