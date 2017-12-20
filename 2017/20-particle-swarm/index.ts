import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';

type Point = { x: number; y: number; z: number };
type Particle = { [attrib in ParticleAttrib]: Point; };
type ParticleAttrib = 'position' | 'velocity' | 'acceleration';

const getParticles = (file: string): Promise<Particle[]> => new Promise((res) => {
  const particles: Particle[] = [];
  const rl = createInterface({
    crlfDelay: global.Infinity,
    input: createReadStream(resolve(__dirname, `../../resources/20-particle-swarm/${file}.txt`)),
  } as any);

  rl.on('line', (line: string) => {
    const [px, py, pz, vx, vy, vz, ax, ay, az] = line.match(/-?\d+/g);
    const position: Point = { x: parseInt(px, 10), y: parseInt(py, 10), z: parseInt(pz, 10) };
    const velocity: Point = { x: parseInt(vx, 10), y: parseInt(vy, 10), z: parseInt(vz, 10) };
    const acceleration: Point = { x: parseInt(ax, 10), y: parseInt(ay, 10), z: parseInt(az, 10) };

    particles.push({ position, velocity, acceleration });
  });

  rl.on('close', () => res(particles));
});

const getSmallestIndexesOf = (type: ParticleAttrib, particles: Particle[]): number[] => {
  const smallestAverage = { index: -1, value: Number.MAX_VALUE };
  const accelerationAverages = [];

  for (let index = 0; index < particles.length; ++index) {
    const avg = Object.keys(particles[index][type]).reduce((a, val) => a + Math.abs(particles[index][type][val]) / 3, 0);

    if (avg < smallestAverage.value) {
      smallestAverage.index = index;
      smallestAverage.value = avg;
    }

    accelerationAverages.push(avg);
  }

  const allSmallestIndexes = [];

  for (let index = 0; index < accelerationAverages.length; ++index) {
    if (accelerationAverages[index] === smallestAverage.value) {
      allSmallestIndexes.push(index);
    }
  }

  return allSmallestIndexes;
};

const getClosestToZero = async (file: string): Promise<number> => {
  const particles = await getParticles(file);
  let smallestParticlesIndexes = [...Array(particles.length).keys()];

  for (const type of ['acceleration', 'velocity', 'position']) {
    const smallestIndexesOfType = getSmallestIndexesOf(type as ParticleAttrib, smallestParticlesIndexes.map(i => particles[i]))
      .map(i => smallestParticlesIndexes[i]);

    if (smallestIndexesOfType.length === 1) {
      return smallestIndexesOfType[0];
    }

    smallestParticlesIndexes = smallestIndexesOfType;
  }

  throw new Error('Ex æquo');
};

const getDeathMatchSurvivors = async (file: string): Promise<number> => {
  const particles = await getParticles(file);
  const board: Map<string, number[]> = new Map();
  let rounds = 100;

  while (--rounds >= 0) {
    particles.forEach((particle, index) => {
      if (!particle) {
        return;
      }

      const key = JSON.stringify(particle.position);
      board.set(key, board.has(key) ? [...board.get(key), index] : [index]);

      particle.position.x += particle.velocity.x + particle.acceleration.x;
      particle.position.y += particle.velocity.y + particle.acceleration.y;
      particle.position.z += particle.velocity.z + particle.acceleration.z;
      particle.velocity.x += particle.acceleration.x;
      particle.velocity.y += particle.acceleration.y;
      particle.velocity.z += particle.acceleration.z;
    });

    board.forEach((position) => {
      if (position.length > 1) {
        position.forEach(index => particles[index] = undefined);
        rounds = 100;
      }
    });

    if (rounds !== 0) {
      board.clear();
    }
  }

  return board.size;
};

(async function () {
  console.log(`Test should be 0: ${await getClosestToZero('test')}`);
  console.log(`Result: ${await getClosestToZero('swarm')}`);
  console.log(`Test should be 1: ${await getDeathMatchSurvivors('test2')}`);
  console.log(`Result: ${await getDeathMatchSurvivors('swarm')}`);
})();
