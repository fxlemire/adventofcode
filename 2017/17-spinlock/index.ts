const getShortCircuit = (steps: number, size: number): number => {
  const buffer = [0];
  let position = 0;
  let zero = 0;
  let afterZero;

  for (let i = 1; i <= size; ++i) {
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

console.log(`Test should be 638: ${getShortCircuit(3, 2017)}`);
console.log(`Result ${getShortCircuit(376, 2017)}`);
console.log(`Result ${getShortCircuit(376, 50000000)}`);
