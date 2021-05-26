///////////////////////////////////////
// Coding Challenge

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array.
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them

HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/

///////////////////////////////////////
// Solution
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
dogs.forEach(dog => (dog.recommendedFood = Math.abs(dog.weight ** 0.75 * 28)));

console.log(dogs);

// 2
const sarahDog = dogs.reduce((str, dog) => {
  if (dog.owners.includes('Sarah')) {
    if (dog.curFood < dog.recommendedFood * 0.9) return `${str} too little`;
    else if (dog.curFood > dog.recommendedFood * 1.1) return `${str} too much`;
    else return `${str} ok!`;
  } else return str;
}, "Sarah's dog is eating");

// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(sarahDog);

// 3
const dogsOwners = dogs.flatMap(dog => dog.owners);

const { little: ownersEatTooLittle, much: ownersEatTooMuch } = dogs.reduce(
  (owners, dog) => {
    if (dog.curFood < dog.recommendedFood * 0.9)
      owners.little.push(...dog.owners);
    else if (dog.curFood > dog.recommendedFood * 1.1)
      owners.much.push(...dog.owners);
    return owners;
  },
  { little: [], much: [] }
);

console.log(ownersEatTooLittle, ownersEatTooMuch);

// 4.
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6
const isEatingOk = (cur, rec) => cur < rec * 1.1 && cur > rec * 0.9;

console.log(dogs.some(dog => isEatingOk(dog.curFood, dog.recommendedFood)));

console.log(
  `${dogs[
    dogs.findIndex(dog => isEatingOk(dog.curFood, dog.recommendedFood))
  ].owners.join(' and ')}'s dog is eating ok!`
);

// 7
const dogsOkArr = dogs.filter(dog =>
  isEatingOk(dog.curFood, dog.recommendedFood)
);

console.log(dogsOkArr);

// 8
const dogsOrderedAsc = [...dogs].sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);

console.log('dogs ', dogs);
console.log('dogs ordered ', dogsOrderedAsc);
*/
