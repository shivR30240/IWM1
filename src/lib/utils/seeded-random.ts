// Mulberry32 PRNG for deterministic mock data
let _seed = 42;

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let _random = mulberry32(_seed);

export function resetSeed(seed: number = 42) {
  _seed = seed;
  _random = mulberry32(_seed);
}

export function random(): number {
  return _random();
}

export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return random() * (max - min) + min;
}

export function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

export function randomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export function randomBoolean(probability: number = 0.5): boolean {
  return random() < probability;
}

export function randomDate(from: Date, to: Date): Date {
  const diff = to.getTime() - from.getTime();
  return new Date(from.getTime() + random() * diff);
}

export function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
