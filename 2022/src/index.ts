import { runDayOne } from './01-calorie-counting';

function enableWatchMode() {
  setInterval(() => {}, 1 << 30);
}

if (process.env.WATCH) {
  enableWatchMode();
}

(async function main() {
  console.log(`Day 1: ${runDayOne().join(' // ')}`);
})();
