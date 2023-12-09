"use strict";
// =======================================================================================
// PROJECT: Bankist App
// =======================================================================================

// ---------------------------------------------------------------------------------------
// A. APP DATA
// ---------------------------------------------------------------------------------------

const account1 = {
	owner: "Melissa Herbst",
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 5000, 3400, -150],
	interestRate: 1.2, // %
	pin: 1111,
	movementsDates: [
		"2019-11-01T13:15:33.035Z",
		"2019-11-30T09:48:16.867Z",
		"2019-12-25T06:04:23.907Z",
		"2020-01-25T14:18:46.235Z",
		"2020-02-05T16:33:06.386Z",
		"2020-04-10T14:43:26.374Z",
		"2020-07-25T18:49:59.371Z",
		"2020-07-26T12:01:20.894Z",
		"2020-11-18T21:31:17.178Z",
		"2020-12-23T07:42:02.383Z",
		"2021-05-28T09:15:04.904Z",
	],
	movementsDescriptions: [
		"Sleeping Giant Inn",
		"Riverwoord Trader",
		"The Bannered Mare",
		"Belethor's General Goods",
		"The Drunken Huntsman",
		"Bee and Barb",
		"The Scorched Hammer",
		"Sleeping Giant Inn",
		"Belethor's General Goods",
		"The Winking Skeever",
		"Angeline's Aromatics"
	],
	currency: "USD",
	locale: "en-US" // de-DE
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210],
	interestRate: 1.5,
	pin: 2222,
	movementsDates: [
		"2020-01-25T14:18:46.235Z",
		"2020-02-05T16:33:06.386Z",
		"2020-04-10T14:43:26.374Z",
		"2020-07-25T18:49:59.371Z",
		"2020-07-26T12:01:20.894Z"
	],
	movementsDescriptions: [
		"The Bannered Mare",
		"Belethor's General Goods",
		"The Drunken Huntsman",
		"Bee and Barb",
		"The Scorched Hammer"
	],
	currency: "EUR",
	locale: "pt-PT" // de-DE
};

const accounts = [account1, account2];

// ---------------------------------------------------------------------------------------
// B. SELECTED DOM ELEMENTS
// ---------------------------------------------------------------------------------------
const labelMessage = document.querySelector(".message");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".btn__login");
const btnLogout = document.querySelector(".btn__logout");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn__sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// ---------------------------------------------------------------------------------------
// C. COMPUTE ACCOUNT USERNAMES
// ---------------------------------------------------------------------------------------
const createUsernames = function (accounts) {
	accounts.forEach((acc) => {
		const usernameCharacters = acc.owner
			.toLowerCase()
			.split(" ")
			.map((word) => {
				return word[0];
			})
			.join("");
		acc.username = usernameCharacters;
	});
};

createUsernames(accounts);

// ---------------------------------------------------------------------------------------
// D. APP FUNCTIONS
// ---------------------------------------------------------------------------------------
// 1. Display UI if logged in / 2. Hide UI if logged out
const displayUI = function () {
	containerApp.classList.remove("display__hidden");
	labelMessage.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`; // display the name
	inputLoginUsername.value = "";
	inputLoginPin.value = "";
	inputLoginUsername.style.display = "none";
	inputLoginPin.style.display = "none";
	btnLogin.classList.add("display__hidden");
	btnLogout.classList.remove("display__hidden");
};

const hideUI = function () {
	currentAccount = "";
	containerApp.classList.add("display__hidden");
	labelMessage.textContent = "Log in to continue...";
	inputLoginUsername.style.display = "block";
	inputLoginPin.style.display = "block";
	btnLogin.classList.remove("display__hidden");
	btnLogout.classList.add("display__hidden");
};

// Timer for automatic user logout
const startLogoutTimer = function () {
	let time = 600000; // 10 minutes
	const timer = setInterval(() => {
		const formattedTime = Intl.DateTimeFormat("en-GB", { minute: "2-digit", second: "2-digit" }).format(time);
		labelTimer.textContent = formattedTime;
		if (!time) {
			clearInterval(timer);
			hideUI();
		}
		time -= 1000;
	}, 1000);
	return timer;
};

const resetTimer = function () {
	clearInterval(timer);
	timer = startLogoutTimer();
};

const formatCurrency = function (locale, currency, value) {
	return Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency
	}).format(value);
};

// MOVEMENTS SECTION
/*
@function "calcDates" is for determining the time passed from the date of when the movement occured and now's current time.
*/
const calcDates = function (movementDate, locale) {
	const calcDaysPassed = function (now, movementDate) {
		return (now - movementDate) / (1000 * 60 * 60 * 24);
	};
	const daysPassed = calcDaysPassed(new Date(), movementDate);
	if (daysPassed < 1) {
		return "Today";
	} else if (daysPassed > 1 && daysPassed < 2) {
		return "Yesterday";
	} else if (daysPassed <= 7) {
		return `${Math.round(daysPassed)} days ago`;
	} else {
		return new Intl.DateTimeFormat(locale).format(movementDate);
	}
};

const displayMovements = function (account) {
	containerMovements.textContent = "";
	account.movements.forEach((movement, i, arr) => {
		const date = calcDates(new Date(account.movementsDates[i]), account.locale);
		const typeHTML = movement > 0 ? "+" : "-";
		const typeClass = movement > 0 ? "deposit" : "withdrawal";
		const html = `
				<div class="movements__row">      
				<div class="movements__index"><p>${i + 1}</p></div>
				<div class="movements__type movements__type--${typeClass}"><p>${typeHTML}</p></div>
				<div>
					<div class="movements__date">${date}</div>
					<div class="movements__description">${account.movementsDescriptions[i]}</div>
				</div>
				<div class="movements__value">${formatCurrency(account.locale, account.currency, movement)}</div>
				</div>`;
		containerMovements.insertAdjacentHTML("afterbegin", html);
	});
};

// BALANCE SECTION
const displayBalance = function (account) {
	// display balance
	account.balance = account.movements.reduce((acc, movement) => {
		return acc + movement;
	});
	labelBalance.textContent = `${formatCurrency(account.locale, account.currency, account.balance)}`;
	// display date
	const now = new Date();
	const options = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "numeric",
		minute: "numeric"
	};
	labelDate.textContent = new Intl.DateTimeFormat(account.locale, options).format(now);
};

// SUMMARY SECTION
const displaySummary = function (account) {
	const deposits = account.movements
		.filter((movement) => {
			return movement > 0;
		})
		.reduce((acc, movement) => {
			return acc + movement;
		});

	const withdrawals = account.movements
		.filter((movement) => {
			return movement < 0;
		})
		.reduce((acc, movement) => {
			return acc + movement;
		}, 0);

	const interest = account.movements
		.filter((movement) => {
			return movement > 0;
		})
		.map((deposit) => {
			return (deposit * account.interestRate) / 100;
		})
		.reduce((acc, interest) => {
			return acc + interest;
		});

	const updateSummaryHTML = () => {
		labelSumIn.textContent = `${formatCurrency(account.locale, account.currency, deposits)}`;
		labelSumOut.textContent = `${formatCurrency(account.locale, account.currency, withdrawals)}`;
		labelSumInterest.textContent = `${formatCurrency(account.locale, account.currency, interest)}`;
	};

	updateSummaryHTML();
};

// Clear Operations Input Fields
const clearInputFields = () => {
	inputTransferTo.value = "";
	inputTransferAmount.value = "";
	inputLoanAmount.value = "";
	inputCloseUsername.value = "";
	inputClosePin.value = "";
};

// Group UI Display Functions
const updateUI = function (account) {
	displayBalance(account);
	displayMovements(account);
	displaySummary(account);
	clearInputFields();
};

// ---------------------------------------------------------------------------------------
// E. IMPLEMENT LOGIN FEATURE / DISPLAY UI
// ---------------------------------------------------------------------------------------
// global variables
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
	e.preventDefault();

	currentAccount = accounts.find((acc) => {
		return acc.username === inputLoginUsername.value;
	});

	if (!currentAccount) {
		labelMessage.textContent = "Incorrect Username or Password";
	}

	if (currentAccount) {
		if (currentAccount.pin !== Number(inputLoginPin.value)) {
			labelMessage.textContent = "Incorrect Username or Password";
		}

		// Login was SUCCESSFUL
		if (currentAccount.pin === Number(inputLoginPin.value)) {
			displayUI();
			timer = startLogoutTimer();
			updateUI(currentAccount);
			// ---------------------------------------------------------------------------
			// F. IMPLEMENT OPERATIONS SECTION
			// ---------------------------------------------------------------------------
			// F --1: Transfers
			btnTransfer.addEventListener("click", function (e) {
				e.preventDefault();
				const amount = Number(Number(inputTransferAmount.value).toFixed(2));
				const recipientAccount = accounts.find((acc) => {
					return acc.username === inputTransferTo.value;
				});
				// Transfer conditions: 1. recipient acc must exist / 2. recipient cannot be current acc / 3. amount must not be lower than 0 and not higher than the balance
				if (recipientAccount && recipientAccount !== currentAccount && amount > 0 && amount < currentAccount.balance) {
					currentAccount.movements.push(amount * -1);
					currentAccount.movementsDates.push(new Date());
					currentAccount.movementsDescriptions.push("Cash Transfer")
					recipientAccount.movements.push(amount);
					recipientAccount.movementsDates.push(new Date());
					recipientAccount.movementsDescriptions.push("Cash Transfer")
				}
				updateUI(currentAccount);
				resetTimer();
			});

			// F --2: Request Loan
			btnLoan.addEventListener("click", function (e) {
				e.preventDefault();
				const amount = Number(Number(inputLoanAmount.value).toFixed(0));
				currentAccount.movements.push(amount);
				currentAccount.movementsDates.push(new Date());
				updateUI(currentAccount);
				resetTimer();
			});

			// F --3: Close Account
			btnClose.addEventListener("click", function (e) {
				e.preventDefault();
				if (
					currentAccount.username === inputCloseUsername.value &&
					currentAccount.pin === Number(inputClosePin.value)
				) {
					const index = accounts.findIndex((acc) => {
						return acc.username === currentAccount.username;
					});
					// delete account at index
					accounts.splice(index, 1);
					console.log(accounts);
					// hide UI & remove message message
					hideUI();
				}
			});
			// ---------------------------------------------------------------------------
			// G. SORT MOVEMENTS
			// ---------------------------------------------------------------------------
			btnSort.addEventListener("click", function () {
				currentAccount.movements.sort((a, b) => a - b);
				updateUI(currentAccount);
			});
			// ---------------------------------------------------------------------------
			// H. LOG OUT
			// ---------------------------------------------------------------------------
			btnLogout.addEventListener("click", function (e) {
				e.preventDefault();
				clearInterval(timer);
				hideUI();
			});
		}
	}
});
