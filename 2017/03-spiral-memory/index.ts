/* logic:
* unfold the square as a line and identify each value which is a corner.
* identify the surrounding corners of your value
* find the middle between the two corners
* add to your distance the steps needed for the position of your value to reach the middle position
* then add the value of the layer of the highest surrounding corner
*/

type CornerName = 'ur' | 'ul' | 'dl' | 'dr';
type Corner = {
  corner: CornerName;
  layer: number;
  value: number;
};
const cornerNamess: CornerName[] = ['ur', 'ul', 'dl', 'dr'];

const corners = {
  *[Symbol.iterator]() { // tslint:disable-line function-name
    let i = 0;
    let value = 1;

    while (true) {
      const layer = Math.floor(i / 4);

      yield {
        layer,
        corner: cornerNamess[i++ % 4],
        value: value += 2 * layer,
      } as Corner;
    }
  },
};

const getSurroundingCorners = (num: number): Corner[] => {
  let precedingCorner: Corner = {
    layer: 0,
    corner: 'dr',
    value: 1,
  };

  if (num <= 1) {
    return [precedingCorner, undefined];
  }

  for (const corner of corners) {
    if (num <= corner.value) {
      return [precedingCorner, corner];
    }

    precedingCorner = corner;
  }
};

const getDistance = (num: number) => {
  const [cornerBefore, cornerAfter] = getSurroundingCorners(num);

  if (!cornerAfter) {
    return 0;
  }

  if (num === cornerBefore.value) {
    return cornerBefore.layer * 2;
  }

  if (num === cornerAfter.value) {
    return cornerAfter.layer * 2;
  }

  const middleValue = cornerBefore.value + Math.floor((cornerAfter.value - cornerBefore.value) / 2);

  return cornerAfter.layer + Math.abs(num - middleValue);
};

console.log(`1: distance ${getDistance(1)}`);
console.log(`7: distance ${getDistance(7)}`);
console.log(`9: distance ${getDistance(9)}`);
console.log(`12: distance ${getDistance(12)}`);
console.log(`23: distance ${getDistance(23)}`);
console.log(`65: distance ${getDistance(65)}`);
console.log(`81: distance ${getDistance(81)}`);
console.log(`82: distance ${getDistance(82)}`);
console.log(`1024: distance ${getDistance(1024)}`);
console.log(`277678: distance ${getDistance(277678)}`);
