import { input } from './index.input';

type ShapeLetters = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';
type OutcomeLetters = 'X' | 'Y' | 'Z';
type Shape = 'Rock' | 'Paper' | 'Scissors';
type Outcome = 'Win' | 'Lose' | 'Draw';

const ShapeDictionary: Record<ShapeLetters, Shape> = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',
  X: 'Rock',
  Y: 'Paper',
  Z: 'Scissors',
};

const ShapePoints: Record<Shape, number> = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
} as const;

const OutcomeDictionary: Record<OutcomeLetters, Outcome> = {
  X: 'Lose',
  Y: 'Draw',
  Z: 'Win',
};

const OutcomePoints: Record<Outcome, number> = {
  Win: 6,
  Lose: 0,
  Draw: 3,
} as const;

const OutcomeChart: Record<Shape, Record<Shape, Outcome>> = {
  Rock: { Scissors: 'Win', Paper: 'Lose', Rock: 'Draw' },
  Paper: { Rock: 'Win', Scissors: 'Lose', Paper: 'Draw' },
  Scissors: { Paper: 'Win', Rock: 'Lose', Scissors: 'Draw' },
};

const StrategyChart: Record<Shape, Record<Outcome, Shape>> = {
  Rock: { Lose: 'Scissors', Win: 'Paper', Draw: 'Rock' },
  Paper: { Lose: 'Rock', Win: 'Scissors', Draw: 'Paper' },
  Scissors: { Lose: 'Paper', Win: 'Rock', Draw: 'Scissors' },
};

function sumScore(rounds: Array<Array<Shape>>): number {
  return rounds
    .flatMap(([opponent, me]) => OutcomePoints[OutcomeChart[me][opponent]] + ShapePoints[me])
    .reduce((sum, score) => sum + score, 0);
}

export function rockPaperScissorsPart1(input: Array<string>) {
  return sumScore(input.map((round) => round.split(' ').map((letter) => ShapeDictionary[letter as ShapeLetters])));
}

export function rockPaperScissorsPart2(input: Array<string>) {
  return sumScore(
    input
      .map((round) => round.split(' '))
      .map(([shape, outcome]) => [
        ShapeDictionary[shape as ShapeLetters],
        StrategyChart[ShapeDictionary[shape as ShapeLetters]][OutcomeDictionary[outcome as OutcomeLetters]],
      ]),
  );
}

export function runDayTwo() {
  return [rockPaperScissorsPart1(input), rockPaperScissorsPart2(input)];
}
