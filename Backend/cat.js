// Ordered by rarity. Least rare first.
const CAT_EYES = ["OrangeEyes", "GreenEyes", "Blue Eyes", "GoldEyes"];
const CAT_COLORS = ["OrangePix", "BrownPix", "whitePix", "TabbyPixel", "TShellPixel", "CalicoPix", "BlackPix"];
const CAT_HATS = ["BluePinkParty", "Bowler", "CowboyHat", "PurpPinkParty", "BlueWiz", "Goggles", "PinkCowboayHat", "PurpWiz", "EarthParty", "Crown"];

export default class Cat {
  // Generate a random cat.
  // `rarityGenerator` is a function that takes in a maximum and returns a number from 0 to that maximum,
  // according to a random distribution depending on the rarity the box should have.
  constructor(rarityGenerator) {
    const eyeIndex = rarityGenerator(CAT_EYES.length - 1);
    const colorIndex = rarityGenerator(CAT_COLORS.length - 1);
    const hatIndex = rarityGenerator(CAT_HATS.length - 1);

    this.eye = CAT_EYES[eyeIndex];
    this.color = CAT_COLORS[colorIndex];
    this.hat = CAT_HATS[hatIndex];
    this.rarity = eyeIndex + colorIndex + hatIndex;
    this.name = "Placeholder until we can get the cat name randomizer working (string)";
    this.imageXY = "Placeholder until we get the pixel coordinate randomizer working (pair)";
    this.alive = true;
  }
}