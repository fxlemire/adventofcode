const getShortCircuitPartOne = (steps: number): number => {
  const buffer = [0];
  let position = 0;
  let zero = 0;
  let afterZero;

  for (let i = 1; i <= 2017; ++i) {
    position = (position + steps + 1) % buffer.length;
    buffer.splice(position, 0, i);

    if (buffer[1] !== afterZero || buffer[0] !== zero) {
      zero = buffer[0];
      afterZero = buffer[1];
      console.log(`${zero}: ${afterZero} (${buffer.length})`);
    }
  }

  return buffer[(position + 1) % buffer.length];
};

const getShortCircuitPartTwo = (steps: number, size: number): number => {
  let val = 0;
  let pos = 0;

  for (let i = 1; i < size; ++i) {
    pos = (pos + steps) % (i);

    if (pos === 0) {
      val = i;
    }

    ++pos;
  }

  return val;
};

console.log(`Test should be 638: ${getShortCircuitPartOne(3)}`);
console.log(`Result ${getShortCircuitPartOne(376)}`);
console.log(`Test should be 16: ${getShortCircuitPartTwo(3, 70)}`);
console.log(`Result ${getShortCircuitPartTwo(376, 50000000)}`);
