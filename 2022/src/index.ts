import { runDayOne } from './01-calorie-counting';
import { runDayTwo } from './02-rock-paper-scissors';

function enableWatchMode() {
  setInterval(() => {}, 1 << 30);
}

if (process.env.WATCH) {
  enableWatchMode();
}

(async function main() {
  console.log(`Day 1: ${runDayOne().join(' // ')}`);
  console.log(`Day 2: ${runDayTwo().join(' // ')}`);
})();
