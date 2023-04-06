const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;

// Getting high score from the local storage
// Yerel depolamadan yüksek puan alanı için

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = ` High Score: ${highScore}`;

const changeFoodPosition = () => {
  // Passing a random 0 - 30 value as food position
  // yiyecek pozisyonu olarak rastgele 0 - 30 değerini geçmek
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const changeDirection = (e) => {
  // Changing velocity value based on key press
  // Tuşa basmaya bağlı olarak hız değerini değiştirme
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((key) => {
  // Calling changeDirection on each key click and passing key dataset value as an object
  // Her tuş tıklamasında değişiklik Yönünü çağırmak ve anahtar veri kümesi değerini bir nesne olarak iletmek
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Checking if the snake hit the food
  // Yılanın yiyeceğe çarpıp çarpmadığını kontrol etmek
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // Pushing food position to snake body array // Yiyecek pozisyonunu yılan gövdesi dizisine itmek
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = ` High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // Shifting forward the values of the elements in the snake body by one
    // Yılan gövdesindeki elementlerin değerlerini birer birer ileri kaydırmak
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position
  // Yılan gövdesinin ilk elemanını mevcut yılan konumuna ayarlama

  // Updating the snake's head position based on the current velocity
  // Mevcut hıza göre yılanın kafa pozisyonunun güncellenmesi

  snakeX += velocityX;
  snakeY += velocityY;

  // Checking if the snake's head is out of wall, if so setting gameOver to true
  //Yılanın kafasının duvardan çıkıp çıkmadığını kontrol etme, eğer öyleyse gameOver'ı true olarak ayarlama

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a div for each part of the snake's body
    // Yılanın vücudunun her parçası için bir div ekleme
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
