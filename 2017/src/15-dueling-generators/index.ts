const getNextValue = (n: number, generator: 'A' | 'B'): number => {
  const factor = generator === 'A' ? 16807 : 48271;

  return n * factor % 2147483647;
};

const isBinaryNumbersLastDigitSame = (a: number, b: number): boolean => {
  const aBin = a.toString(2).split('').reverse().join('');
  const bBin = b.toString(2).split('').reverse().join('');

  return aBin.startsWith(bBin.substr(0, 16));
};

const getTotalMatchesPartOne = (rounds = 40000000, generatorA = 512, generatorB = 191): number => {
  let r = rounds;
  let nextA = generatorA;
  let nextB = generatorB;
  let totalMatches = 0;

  while (r-- > 0) {
    nextA = getNextValue(nextA, 'A');
    nextB = getNextValue(nextB, 'B');

    if (isBinaryNumbersLastDigitSame(nextA, nextB)) {
      ++totalMatches;
    }
  }

  return totalMatches;
};

const getTotalMatchesPartTwo = (pairs = 5000000, generatorA = 512, generatorB = 191): number => {
  let totalMatches = 0;
  const valuesA = [];
  const valuesB = [];
  const populate = (array: number[], start: number, generator: 'A' | 'B'): void => {
    let next = start;
    const modulo = generator === 'A' ? 4 : 8;

    while (array.length < pairs) {
      next = getNextValue(next, generator);

      if (next % modulo === 0) {
        array.push(next);
      }
    }
  };

  populate(valuesA, generatorA, 'A');
  populate(valuesB, generatorB, 'B');

  for (let i = 0; i < valuesA.length; ++i) {
    if (isBinaryNumbersLastDigitSame(valuesA[i], valuesB[i])) {
      ++totalMatches;
    }
  }

  return totalMatches;
};

console.log(`Test should be 1: ${getTotalMatchesPartOne(5, 65, 8921)}`);
console.log(`Test should be 588: ${getTotalMatchesPartOne(40000000, 65, 8921)}`);
console.log(`Result: ${getTotalMatchesPartOne()}`);

console.log(`Test should be 0: ${getTotalMatchesPartTwo(5, 65, 8921)}`);
console.log(`Test should be 1: ${getTotalMatchesPartTwo(1056, 65, 8921)}`);
console.log(`Test should be 309: ${getTotalMatchesPartTwo(5000000, 65, 8921)}`);
console.log(`Result: ${getTotalMatchesPartTwo()}`);
