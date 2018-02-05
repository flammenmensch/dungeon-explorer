export const randomBetween = (a:number, b:number, isInteger:boolean=false):number => {
  let numBetween:number = a + Math.random() * (b - a);

  if (isInteger) {
    numBetween = Math.floor(numBetween);
  }

  return numBetween;
};
