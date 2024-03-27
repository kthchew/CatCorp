import random from "random";

// Cached random distributions
const LOOTBOX_RANDOM_DISTRIBUTIONS = {};

// TODO: does this RNG provide a good experience for the # of possibilities we expect to have?
// TODO: do not export after removing test /randomCat endpoint
export const LOOTBOX_RARITY_FUNCTIONS = [
  (max) => {
    if (LOOTBOX_RANDOM_DISTRIBUTIONS["0"] === undefined) {
      LOOTBOX_RANDOM_DISTRIBUTIONS["0"] = random.geometric(0.7);
    }
    const val = LOOTBOX_RANDOM_DISTRIBUTIONS["0"]() - 1;
    return val > max ? max : val;
  },
  (max) => {
    if (LOOTBOX_RANDOM_DISTRIBUTIONS["1"] === undefined) {
      LOOTBOX_RANDOM_DISTRIBUTIONS["1"] = random.geometric(0.35);
    }
    const val = LOOTBOX_RANDOM_DISTRIBUTIONS["1"]() - 1;
    return val > max ? max : val;
  },
  (max) => {
    if (LOOTBOX_RANDOM_DISTRIBUTIONS["2:" + max] === undefined) {
      LOOTBOX_RANDOM_DISTRIBUTIONS["2:" + max] = random.poisson(max * 0.5);
    }
    const val = Math.round(LOOTBOX_RANDOM_DISTRIBUTIONS["2:" + max]());
    return val > max ? max : val;
  },
  (max) => {
    if (LOOTBOX_RANDOM_DISTRIBUTIONS["3:" + max] === undefined) {
      LOOTBOX_RANDOM_DISTRIBUTIONS["3:" + max] = random.poisson(max * 0.75);
    }
    const val = Math.round(LOOTBOX_RANDOM_DISTRIBUTIONS["3:" + max]());
    return val > max ? max : val;
  },
]

export const LOOTBOX_COSTS = [
  300,
  600,
  1200,
  2400
];

export class LootboxOpenError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "LootboxOpenError";
  }
}