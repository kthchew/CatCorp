import words from './generic-food.js'

// Ordered by rarity. Least rare first.
const CAT_EYES = ["orange", "green", "blue", "gold"];
const CAT_COLORS = ["orange", "brown", "white", "tabby", "tshell", "calico", "black"];
const CAT_HATS = ["partyBlue", "bowler", "cowboy", "partyPurple", "wizardBlue", "goggles", "cowboyPink", "wizardPurple", "partyEarth", "crown"];

export default class Cat {
  // Generate a random cat.
  // `rarityGenerator` is a function that takes in a maximum and returns a number from 0 to that maximum,
  // according to a random distribution depending on the rarity the box should have.
  constructor(rarityGenerator) {
    const eyeIndex = rarityGenerator(CAT_EYES.length - 1);
    const colorIndex = rarityGenerator(CAT_COLORS.length - 1);
    const hatIndex = rarityGenerator(CAT_HATS.length - 1);

    this.eyes = CAT_EYES[eyeIndex];
    this.pattern = CAT_COLORS[colorIndex];
    this.hat = CAT_HATS[hatIndex];
    this.rarity = eyeIndex + colorIndex + hatIndex;
    this.name = words[Math.floor(Math.random() * words.length)];
    this.x = Math.random();
    this.y = Math.random();
    this.alive = true;
  }
}