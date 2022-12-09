import { input } from './index.input';

type Coordinates = { row: number; column: number };
type Cardinal = typeof CARDINAL_POINTS[number];

const CARDINAL_POINTS = ['North', 'South', 'East', 'West'] as const;

function isTreeVisible(tree: number, neighbours: Array<number>) {
  return tree > Math.max(...neighbours);
}

function getNeighboursInDirection(
  treeCoordinates: Coordinates,
  trees: Array<Array<number>>,
  direction: Cardinal,
): Array<number> {
  let neighbours: Array<number>;

  switch (direction) {
    case 'North': {
      neighbours = trees
        .slice(0, treeCoordinates.row)
        .reduce((acc, row) => [row[treeCoordinates.column]].concat(acc), []);
      break;
    }
    case 'South': {
      neighbours = trees
        .slice(treeCoordinates.row + 1)
        .reduce((acc, row) => acc.concat(row[treeCoordinates.column]), []);
      break;
    }
    case 'East': {
      neighbours = trees[treeCoordinates.row].slice(treeCoordinates.column + 1);
      break;
    }
    case 'West': {
      neighbours = trees[treeCoordinates.row].slice(0, treeCoordinates.column).reverse();
      break;
    }
    default: {
      throw new Error('impossiburu!');
    }
  }

  return neighbours;
}

function isTreeVisibleFromAnyDirection(treeCoordinates: Coordinates, trees: Array<Array<number>>): boolean {
  const tree = trees[treeCoordinates.row][treeCoordinates.column];

  for (const cardinalPoint of CARDINAL_POINTS) {
    const neighbours = getNeighboursInDirection(treeCoordinates, trees, cardinalPoint);

    if (isTreeVisible(tree, neighbours)) {
      return true;
    }
  }

  return false;
}

export function treetopTreeHousePart1(trees: Array<Array<number>>): number {
  const width = trees[0].length;
  const height = trees.length;

  const treesOnEdge = (width + height) * 2 - 4;
  let visibleTrees = treesOnEdge;

  for (let i = 1; i < trees.length - 1; ++i) {
    for (let j = 1; j < trees[i].length - 1; ++j) {
      if (isTreeVisibleFromAnyDirection({ row: i, column: j }, trees)) {
        ++visibleTrees;
      }
    }
  }

  return visibleTrees;
}

function getViewingDistance(tree: number, neighbours: Array<number>): number {
  const viewingDistance = neighbours.findIndex((neighbour) => neighbour >= tree);

  return viewingDistance === -1 ? neighbours.length : viewingDistance + 1;
}

function getViewingDistances(treeCoordinates: Coordinates, trees: Array<Array<number>>): Array<number> {
  const tree = trees[treeCoordinates.row][treeCoordinates.column];
  const viewingDistances: Array<number> = [];

  for (const cardinalPoint of CARDINAL_POINTS) {
    const neighbours = getNeighboursInDirection(treeCoordinates, trees, cardinalPoint);
    viewingDistances.push(getViewingDistance(tree, neighbours));
  }

  return viewingDistances;
}

function getScenicScore(viewingDistances: Array<number>): number {
  return viewingDistances.reduce((acc, viewingDistance) => acc * viewingDistance, 1);
}

export function treetopTreeHousePart2(trees: Array<Array<number>>): number {
  let highestScenicScore = 0;

  for (let i = 1; i < trees.length - 1; ++i) {
    for (let j = 1; j < trees[i].length - 1; ++j) {
      const viewingDistances = getViewingDistances({ row: i, column: j }, trees);
      const scenicScore = getScenicScore(viewingDistances);

      if (highestScenicScore < scenicScore) {
        highestScenicScore = scenicScore;
      }
    }
  }

  return highestScenicScore;
}

export function runDayEight() {
  const trees = input.map((row) => row.split('').map(Number));

  return [treetopTreeHousePart1(trees), treetopTreeHousePart2(trees)];
}
