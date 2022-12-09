import { input } from './index.input';

const MAX_DISTANCE_BETWEEN_HEAD_TAIL = Math.sqrt(2);

function isTailTooFar(head: [number, number], tail: [number, number]): boolean {
  const [headX, headY] = head;
  const [tailX, tailY] = tail;

  return Math.hypot(headY - tailY, headX - tailX) > MAX_DISTANCE_BETWEEN_HEAD_TAIL;
}

function setPositionVisited(positionsVisited: Set<string>, position: [number, number]) {
  positionsVisited.add(position.join(','));
}

function adjustTails(positionsVisited: Set<string>, head: [number, number], tails: Array<[number, number]>) {
  if (!tails.length) {
    setPositionVisited(positionsVisited, head);
    return;
  }

  const tail = tails[0];

  if (isTailTooFar(head, tail)) {
    const isHeadLeft = head[0] < tail[0];
    const isHeadRight = head[0] > tail[0];
    const isHeadUp = head[1] > tail[1];
    const isHeadDown = head[1] < tail[1];

    if (isHeadLeft) {
      --tail[0];
    }
    if (isHeadRight) {
      ++tail[0];
    }
    if (isHeadUp) {
      ++tail[1];
    }
    if (isHeadDown) {
      --tail[1];
    }
  }

  adjustTails(positionsVisited, tail, tails.slice(1));
}

function simulateRopeBridge(ropeSize: number, directions: Array<[string, number]>) {
  const positionsVisited: Set<string> = new Set();
  const currentHeadPosition: [number, number] = [0, 0];
  const tails: Array<[number, number]> = Array.from({ length: ropeSize - 1 }).map((i) => [0, 0]);
  setPositionVisited(positionsVisited, tails[0]);

  for (const [direction, quantity] of directions) {
    let quantityRemaining = quantity;

    while (quantityRemaining-- > 0) {
      switch (direction) {
        case 'U': {
          ++currentHeadPosition[1];
          break;
        }
        case 'D': {
          --currentHeadPosition[1];
          break;
        }
        case 'L': {
          --currentHeadPosition[0];
          break;
        }
        case 'R': {
          ++currentHeadPosition[0];
          break;
        }
        default: {
          throw new Error('impossiburu!');
        }
      }

      adjustTails(positionsVisited, currentHeadPosition, tails);
    }
  }

  return positionsVisited.size;
}

export function ropeBridgePart1(directions: Array<[string, number]>): number {
  return simulateRopeBridge(2, directions);
}

export function ropeBridgePart2(directions: Array<[string, number]>): number {
  return simulateRopeBridge(10, directions);
}

export function runDayNine() {
  return [ropeBridgePart1(input), ropeBridgePart2(input)];
}
