import { runDayOne } from './01-calorie-counting';
import { runDayTwo } from './02-rock-paper-scissors';
import { runDayThree } from './03-rucksack-reorganization';
import { runDayFour } from './04-camp-cleanup';
import { runDayFive } from './05-supply-stacks';
import { runDaySix } from './06-tuning-trouble';
import { runDaySeven } from './07-no-spaceleft-on-device';
import { runDayEight } from './08-treetop-tree-house';
import { runDayNine } from './09-rope-bridge';
import { runDayTen } from './10-cathode-ray-tube';
import { runDayEleven } from './11-monkey-in-the-middle';

function enableWatchMode() {
  setInterval(() => {}, 1 << 30);
}

if (process.env.WATCH) {
  enableWatchMode();
}

(async function main() {
  console.log(`Day 1: ${runDayOne().join(' // ')}`);
  console.log(`Day 2: ${runDayTwo().join(' // ')}`);
  console.log(`Day 3: ${runDayThree().join(' // ')}`);
  console.log(`Day 4: ${runDayFour().join(' // ')}`);
  console.log(`Day 5: ${(await runDayFive()).join(' // ')}`);
  console.log(`Day 6: ${runDaySix().join(' // ')}`);
  console.log(`Day 7: ${(await runDaySeven()).join(' // ')}`);
  console.log(`Day 8: ${runDayEight().join(' // ')}`);
  console.log(`Day 9: ${runDayNine().join(' // ')}`);
  const [dayTenPart1, dayTenPart2] = await runDayTen();
  console.log(`Day 10: ${dayTenPart1}`);
  dayTenPart2.forEach((screenRow) => console.log(screenRow));
  console.log(`Day 11: ${(await runDayEleven()).join(' // ')}`);
})();
