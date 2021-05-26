'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// App functions
const displayMovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? [...movements].sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${++i} ${type}
        </div>
        <div class="movements__value">${mov}$</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}$`;
};

const calcDisplaySummary = ({ movements, interestRate: i = 1 }) => {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}$`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * i) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

const createUserNames = accounts => {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .split(' ')
      .map(n => n[0])
      .join('')
      .toLowerCase();
  });
};
createUserNames(accounts);

const updateUI = acc => {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const resetInputs = (...inputs) =>
  inputs.forEach(input => {
    input.value = '';
    input.blur();
  });

// Reduce examples
const overallBalance = accounts
  // .map(acc => acc.movements).flat(1)
  .flatMap(acc => acc.movements)
  .reduce((bal, mov) => bal + mov, 0);

const movementsAverage = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov, _, movs) => acc + mov / movs.length, 0);

const { d: deposits, w: withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (movs, mov) => {
      // mov > 0 ? (movs.d += mov) : (movs.w += mov);
      movs[mov > 0 ? 'd' : 'w'] += mov;
      return movs;
    },
    { d: 0, w: 0 }
  );

const converToTitleCase = str => {
  const exceptions = [
    'a',
    'an',
    'and',
    'the',
    'but',
    'of',
    'on',
    'or',
    'in',
    'is',
    'with',
  ];
  return str
    .toLowerCase()
    .split(' ')
    .reduce(
      (str, word) =>
        str +
        `${str && ' '}${
          str && exceptions.includes(word)
            ? word
            : word[0].toUpperCase() + word.slice(1)
        }`,
      ''
    );
};

// console.log(deposits, withdrawals);
// console.log(converToTitleCase('this is a string FOR Testing the reduce'));
// console.log(converToTitleCase('last and only'));
// console.log(converToTitleCase('and there you go...'));

const arr1to10 = Array.from({ length: 10 }, (_, i) => ++i);
const arrOf1s = Array.from({ length: 5 }, () => 1);

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    resetInputs(inputLoginUsername, inputLoginPin);
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    receiver.username !== currentAccount.username
  ) {
    resetInputs(inputTransferAmount, inputTransferTo);
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    resetInputs(inputLoanAmount);
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    resetInputs(inputCloseUsername, inputClosePin);
    containerApp.style.opacity = 0;
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
  }
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);
});
