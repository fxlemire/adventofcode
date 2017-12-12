import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

const getPipes = (file: string): Promise<Map<string, string[]>> => new Promise((res) => {
  const pipes = new Map<string, string[]>();

  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/12-digital-plumber/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    const [sender, ...receivers] = line.match(/\d+/g);
    pipes.set(sender, receivers);
  });

  rl.on('close', () => res(pipes));
});

const getFriendsOf = async (file: string, star = '0', pipes?: Map<string, string[]>): Promise<Set<string>> => {
  const network = pipes || await getPipes(file);
  const friends = new Set<string>([star]);
  const visited = new Set<string>();

  const getFriends = (user = star): number => {
    if (visited.has(user)) {
      return;
    }

    const receivers = network.get(user);
    visited.add(user);

    for (const friend of receivers) {
      friends.add(friend);
      getFriends(friend);
    }

    return friends.size;
  };

  getFriends();

  return friends;
};

const getGroups = async (file: string, star = '0'): Promise<number> => {
  const pipes = await getPipes(file);
  let groups = 0;

  while (pipes.size > 0) {
    const friends = await getFriendsOf(undefined, pipes.keys().next().value, pipes);

    for (const friend of friends) {
      pipes.delete(friend);
    }

    ++groups;
  }

  return groups;
};

(async function () {
  console.log(`Test should be 6: ${(await getFriendsOf('test')).size}`);
  console.log(`Test2 should be 3: ${(await getFriendsOf('test2')).size}`);
  console.log(`Result: ${(await getFriendsOf('pipes')).size}`);
  console.log(`Test should be 2: ${await getGroups('test')}`);
  console.log(`Test2 should be 3: ${await getGroups('test2')}`);
  console.log(`Result: ${await getGroups('pipes')}`);
})();
