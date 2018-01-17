import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type BridgeData = {
  type: number,
  used: boolean,
};

type Bridge = {
  id: number,
  data: [BridgeData, BridgeData],
};

type Store = {
  [key: number]: number[],
};

const getInstructions = (file: string): Promise<{components: Bridge[], starters: Bridge[], store: Store}> => new Promise((res) => {
  const components: Bridge[] = [];
  const starters: Bridge[] = [];
  const store: Store = {};
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/24-electromagnetic-moat/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    const [b1, b2] = line.split('/').map(d => parseInt(d, 10));
    const id = components.length;
    const bridge: Bridge = { id, data: [{ type: b1, used: false }, { type: b2, used: false }] };

    if (b1 === 0 || b2 === 0) {
      if (b1 === 0) {
        bridge.data[0].used = true;
      } else {
        bridge.data[1].used = true;
      }

      starters.push(bridge);
    } else {
      components.push(bridge);
      store[b1] = store[b1] ? [...store[b1], id] : [id];
      store[b2] = store[b2] ? [...store[b2], id] : [id];
    }
  });

  rl.on('close', () => res({ components, starters, store }));
});

const getStrongestBridge = async (file: string): Promise<number> => {
  const { components, starters, store } = await getInstructions(file);
  let bridgeStrength = 0;

  const bridgeTraversal = (bridge: Bridge[], nextNum: number): void => {
    if (store[nextNum].length > 0) {
      const nextIndex = store[nextNum].pop();
      const nextComponentData = components[nextIndex].data;
      const nextNextNum = nextComponentData[0].type === nextNum ? nextComponentData[1].type : nextComponentData[0].type;

      const nextBridge = bridge.concat(components[nextIndex]);

      const nextNumId = components[nextIndex].id;
      const indexToRemove = store[nextNextNum].findIndex(c => c === nextNumId);
      store[nextNextNum].splice(indexToRemove, 1);

      bridgeTraversal(nextBridge, nextNextNum);
    } else {
      const strength = bridge.reduce((acc, b) => b.data[0].type + b.data[1].type + acc, 0);

      if (bridgeStrength < strength) {
        bridgeStrength = strength;
      }

      // restore store
      store[nextNum].push(bridge[bridge.length - 1].id);
      const lastComponent = bridge[bridge.length - 1];
      const storeIndex = lastComponent.data[0].type === nextNum ? lastComponent.data[1].type : lastComponent.data[0].type;
      store[storeIndex].push(bridge[bridge.length - 1].id);
    }
  };

  starters.forEach((starter) => {
    const strength = bridgeTraversal([starter], starter.data[0].type || starter.data[1].type);
  });

  return bridgeStrength;
};

(async function () {
  console.log(`Test should be 31: ${await getStrongestBridge('test')}`);
})();
