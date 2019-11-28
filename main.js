"use strict";

//Blackjack

//card variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

//DOM variables
let textArea1 = document.getElementById("text-area1");
let textArea2 = document.getElementById("text-area2");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");

//game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

newGameButton.addEventListener("click", event => {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  //textArea.innerText = "Game started";
  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  showStatus();
});

hitButton.addEventListener("click", event => {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener("click", event => {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});


function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    //nested loop
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
    console.log(deck);
  }
  return deck;
}

function shuffleDeck(deck) {
  for(let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return `${card.value} of ${card.suit}`
}
// for (let i = 0; i < deck.length; i++) {
//   console.log("carte de joc:", deck[i]);
// }

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch (card.value) {
    case "Ace":
      return 1;
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 8;
    case "Nine":
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;

  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);

    if (card.value === "Ace") {
      hasAce = true;
    }
  }

  if (score && hasAce + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
  updateScores();
  if (gameOver) {
    while (playerScore > dealerScore
    && playerScore <= 21
    && dealerScore <= 21) {
      getNextCard().push(dealerCards);
      updateScores();
    }
  }

  if (playerScore > 21) {
    gameOver = true;
    playerWon = false;
  } else if (dealerScore > 21) {
    gameOver = true;
    playerWon = true;
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    } else {
      playerWon = false;
    }
  }
}

 function showStatus() {
   if (!gameStarted) {
     textArea1.innerHTML = "<span class='welcome'>Welcome to Bluejack!</span>";
     return;
   }

   let dealerCardString = "";

   for (let i = 0; i < dealerCards.length; i++) {
     dealerCardString += getCardString(dealerCards[i]) + "<br>";
   }

   console.log("dealer:", dealerCardString);

   let playerCardString = "";

   for (let i = 0; i < playerCards.length; i++) {
     playerCardString += getCardString(playerCards[i]) + "<br>";
   }

   console.log("player:", playerCardString);

   updateScores();

   textArea1.innerHTML = `Dealer has:
   <p class="dealer-cards">${dealerCardString}</p>
   <p>(score: <span class="score">${dealerScore}</span>)</p>`

   textArea2.innerHTML = `You have:
   <p class="player-cards">${playerCardString}</p>
   <p>(score: <span class="score">${playerScore}</span>)<p>`


   if (gameOver) {
     if(playerWon) {
       textArea1.innerText = "You win";
     } else {
       textArea2.innerText = "Dealer win";
     }
     newGameButton.style.display = "inline";
     stayButton.style.display = "none";
     hitButton.style.display = "none";
   }
 }
