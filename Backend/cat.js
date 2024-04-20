import words from './generic-food.js'

// Ordered by rarity. Least rare first.
const CAT_EYES_LEFT = ["orangeLeft", "greenLeft", "blueLeft", "goldLeft"];
const CAT_EYES_RIGHT = ["orangeRight", "greenRight", "blueRight", "goldRight"];
const CAT_COLORS = ["orange", "brown", "white", "tabby", "tshell", "calico", "black"];
const CAT_HATS = ["partyBlue", "bowler", "brownHair", "cowboy", "partyPurple", "blondeHair", "wizardBlue", "goggles", "cowboyPink", "gingerHair", "wizardPurple", "partyEarth", "rainbow", "crown"];

export default class Cat {
  // Generate a random cat.
  // `rarityGenerator` is a function that takes in a maximum and returns a number from 0 to that maximum,
  // according to a random distribution depending on the rarity the box should have.
  constructor(rarityGenerator) {
    let eyeIndex = rarityGenerator(CAT_EYES_LEFT.length - 1);
    const colorIndex = rarityGenerator(CAT_COLORS.length - 1);
    const hatIndex = rarityGenerator(CAT_HATS.length - 1);

    this.leftEye = CAT_EYES_LEFT[eyeIndex];
    this.rarity = eyeIndex + colorIndex + hatIndex;
    this.pattern = CAT_COLORS[colorIndex];
    this.hat = CAT_HATS[hatIndex];
    this.name = words[Math.floor(Math.random() * words.length)];
    this.x = Math.random();
    this.y = Math.random();
    this.alive = true;

    if (Math.random()<0.005) {
      eyeIndex = rarityGenerator(CAT_EYES_RIGHT.length - 1);
      if (CAT_EYES_RIGHT[eyeIndex] != this.leftEye) {
        this.rarity += eyeIndex + 4 //double eye bonus
      }
    }
    this.rightEye = CAT_EYES_RIGHT[eyeIndex];
  }
}