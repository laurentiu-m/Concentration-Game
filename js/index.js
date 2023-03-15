cards = document.querySelectorAll(".card-back");

let icons = [
  "images/apple.png",
  "images/avocado.png",
  "images/banana.png",
  "images/cherries.png",
  "images/lemon.png",
  "images/pineapple.png",
  "images/strawberry.png",
  "images/watermelon.png",
];

let cardsIcon = [...icons, ...icons];
let cardsCount = cardsIcon.length;

let clickCount = 0;
let revealedCards = 0;
let score = 0;
let activeCards = [];
let awaitingEndOfMove = false;
let timerID;
let startTime = 0;
let endTime = 0;

let winScreen = document.querySelector("#win-container");

let clickCountDisplay = document.querySelector("#click-count");

let timerDisplay = document.querySelector("#timer");

let winTime = document.querySelector("#win-time");

let winMove = document.querySelector("#win-move");

let startGame = document.querySelector("#main-game");

let startGameAgain = document.querySelector("#play-again");

let gameHeading = document.querySelector("#game-heading");

let startButton = document.querySelector("#start-game");

startButton.addEventListener("click", function () {
  // Call the function that starts your memory game
  startConcentrationGame();
});

// When the play again button is pressed the variables are reset and calls the fucntion to start the game
startGameAgain.addEventListener("click", function () {
  clickCount = 0;
  revealedCards = 0;
  score = 0;
  activeCards = [];
  awaitingEndOfMove = false;
  startTime = 0;
  endTime = 0;
  // Deletes everything inside of cards
  cards.forEach((card) => {
    card.innerHTML = "";
  });
  // Clears the timer
  clearTimeout(timerID);
  // Set the moves to 0
  clickCountDisplay.textContent = "0";

  startConcentrationGame();
});

// Function that starts the game
function startConcentrationGame() {
  startGameAgain.classList.add("win-button-hide");
  document
    .querySelector("#win-row-container-hide")
    .classList.add("win-row-container-hide");
  startButton.classList.add("main-button-hide");
  startGame.classList.remove("game-hide");
  gameHeading.classList.add("game-heading-active");
  gameHeading.classList.remove("game-heading-hide");

  // Timer
  function updateTimer() {
    startTime++;
    let minutes = Math.floor(startTime / 60);
    let seconds = startTime % 60;
    timerDisplay.textContent =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    timerID = setTimeout(updateTimer, 1000);
  }

  timerID = setTimeout(updateTimer, 1000);

  // Adding the icons to the div and comparing it
  function buildIcon(icon, index) {
    const element = document.createElement("img");
    // Adding the necesary classes to icons
    element.classList.add("card-content");
    element.setAttribute("data-icon", icon);
    element.setAttribute("data-revealed", "false");
    clickCountDisplay.textContent = clickCount;
    // On click icons will appear and compare with each other
    cards[index].addEventListener("click", function () {
      const revealed = element.getAttribute("data-revealed");
      // If the move ended, 2 cards were revealed and the card was already revealed is true, the program will do nothing
      if (awaitingEndOfMove || revealedCards >= 2 || revealed === "true") {
        return;
      }
      clickCount++;
      clickCountDisplay.textContent = clickCount;
      // Adding the source code to the img to make the icons appear
      element.src = icon;
      // Clicked card is revealed and set to true
      element.setAttribute("data-revealed", "true");
      // Adding the img elements to activeCards
      activeCards.push(element);
      revealedCards++;

      // If the user revealed two cards, it will compare them
      if (revealedCards === 2) {
        const firstCardIcon = activeCards[0].getAttribute("data-icon");
        const secondCardIcon = activeCards[1].getAttribute("data-icon");
        if (firstCardIcon === secondCardIcon) {
          activeCards.forEach((card) => {
            card.setAttribute("data-revealed", "true");
            element.setAttribute("data-revealed", "true");
          });
          awaitingEndOfMove = false;
          activeCards = [];
          revealedCards = 0;
          score += 2;
          // If all cards are found game ends
          if (score == cardsCount) {
            let totalTime = Math.abs(endTime - startTime);
            let totalMinutes = Math.floor(totalTime / 60);
            let totalSeconds = totalTime % 60;
            let totalTimeFormatted =
              totalMinutes.toString().padStart(2, "0") +
              ":" +
              totalSeconds.toString().padStart(2, "0");
            winTime.textContent = totalTimeFormatted;
            winMove.textContent = clickCount;
            startGame.classList.add("game-hide");
            winScreen.classList.remove("win-hide");
            gameHeading.classList.remove("game-heading-active");
            gameHeading.classList.add("game-heading-hide");
            startGameAgain.classList.remove("win-button-hide");
            document
              .querySelector("#win-row-container-hide")
              .classList.remove("win-row-container-hide");
          }
          // Else the card will be flipped over
        } else {
          awaitingEndOfMove = true;
          setTimeout(() => {
            activeCards.forEach((card) => {
              card.src = "";
              card.setAttribute("data-revealed", "false");
            });
            activeCards = [];
            revealedCards = 0;
            awaitingEndOfMove = false;
          }, 1000);
        }
      }
    });
    return element;
  }

  // Duplicating the icons
  const iconDuplicate = [...cardsIcon];

  // A loop that will give a random array of icons
  for (let i = 0; i < cardsCount; i++) {
    const randomIndex = Math.floor(Math.random() * iconDuplicate.length);
    const icon = iconDuplicate[randomIndex];
    // Calling the buildIcon to creat the game
    const iconImg = buildIcon(icon, i);
    iconDuplicate.splice(randomIndex, 1);
    // Adding the icons to all ".card-back" classes
    cards[i].appendChild(iconImg);
  }
}
