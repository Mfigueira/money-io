'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MoneyIO APP

// Data
const account1 = {
  owner: 'Andrea Bocconi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-05-22T18:49:59.371Z',
    '2021-05-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'it-IT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2021-05-19T18:49:59.371Z',
    '2021-05-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Juan Perez',
  movements: [500, -340, -1650, 110, 450, 500, 10400, -3000],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2021-05-19T18:49:59.371Z',
    '2021-05-26T12:01:20.894Z',
  ],
  currency: 'ARS',
  locale: 'es-AR',
};

const accounts = [account1, account2, account3];

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
const formatMovementDate = (date, locale = navigator.locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
};

const formatCurrency = (locale, curr, num) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
  }).format(num);

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const movDate = formatMovementDate(
      new Date(acc.movementsDates[i]),
      acc.locale
    );

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${++i} ${type}
        </div>
        <div class="movements__date">${movDate}</div>
        <div class="movements__value">${formatCurrency(
          acc.locale,
          acc.currency,
          mov
        )}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(
    account.locale,
    account.currency,
    account.balance
  )}`;
};

const calcDisplaySummary = ({
  movements,
  interestRate: i = 1,
  locale,
  currency,
}) => {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurrency(locale, currency, incomes)}`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCurrency(
    locale,
    currency,
    Math.abs(outcomes)
  )}`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * i) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCurrency(
    locale,
    currency,
    interest
  )}`;
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
  displayMovements(acc);
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

// Array from
const arr1to10 = Array.from({ length: 10 }, (_, i) => ++i);
const arrOf1s = Array.from({ length: 5 }, () => 1);

// Numbers
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    resetInputs(inputLoginUsername, inputLoginPin);

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale ?? navigator.locale,
      options
    ).format(now);
    // day/month/year
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    Number.isFinite(amount) &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    receiver.username !== currentAccount.username
  ) {
    resetInputs(inputTransferAmount, inputTransferTo);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movements.push(amount);
    receiver.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    resetInputs(inputLoanAmount);
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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
  displayMovements(currentAccount, sorted);
});
