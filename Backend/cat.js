// Ordered by rarity. Least rare first.
// TODO: actually put stuff here
const CAT_EYES = ["test eyes 1", "test eyes 2"];
const CAT_EARS = ["test ears 1", "test ears 2"];
const CAT_COLORS = ["test color 1", "test color 2"];
const CAT_HATS = ["test hat 1", "test hat 2"];

export default class Cat {
  // Generate a random cat.
  // `rarityGenerator` is a function that takes in a maximum and returns a number from 0 to that maximum,
  // according to a random distribution depending on the rarity the box should have.
  constructor(rarityGenerator) {
    const eyeIndex = rarityGenerator(CAT_EYES.length - 1);
    const earIndex = rarityGenerator(CAT_EARS.length - 1);
    const colorIndex = rarityGenerator(CAT_COLORS.length - 1);
    const hatIndex = rarityGenerator(CAT_HATS.length - 1);

    this.eye = CAT_EYES[eyeIndex];
    this.ear = CAT_EARS[earIndex];
    this.color = CAT_COLORS[colorIndex];
    this.hat = CAT_HATS[hatIndex];
  }
}