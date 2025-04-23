// Game variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let snake = [];
let food = {};
let direction = "right";
let nextDirection = "right";
let gameSpeed = 100; // Default medium speed
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let startTime;
let playerName = "";
let snakeColor = "#6f4f1f";

// DOM elements
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const playerNameDisplay = document.getElementById("playerName");
const finalScoreDisplay = document.getElementById("finalScore");
const timeDisplay = document.getElementById("time");
const snakeLengthDisplay = document.getElementById("snakeLength");
const dateTimeDisplay = document.getElementById("dateTime");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const modeToggle = document.getElementById("modeToggle");

// Initialize canvas size
function initCanvas() {
  canvas.width = 600;
  canvas.height = 400;
}

// Initialize game
function initGame() {
  // Reset snake
  snake = [];
  for (let i = 3; i >= 0; i--) {
    snake.push({ x: i * 10, y: 0 });
  }

  // Reset direction
  direction = "right";
  nextDirection = "right";

  // Generate first food
  generateFood();

  // Reset score
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;

  // Set start time
  startTime = new Date();
}

// Generate food at random position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
    y: Math.floor(Math.random() * (canvas.height / 10)) * 10,
  };

  // Ensure food not on snake
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      generateFood();
      return;
    }
  }
}

// Main game loop
function gameLoop() {
  moveSnake();
  if (checkCollision()) {
    gameOver();
    return;
  }
  draw();
}

// Move snake
function moveSnake() {
  direction = nextDirection;
  let head = { x: snake[0].x, y: snake[0].y };

  switch (direction) {
    case "right":
      head.x += 10;
      break;
    case "left":
      head.x -= 10;
      break;
    case "up":
      head.y -= 10;
      break;
    case "down":
      head.y += 10;
      break;
  }

  // Ate food?
  if (head.x === food.x && head.y === food.y) {
    generateFood();
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

// Collision detection
function checkCollision() {
  const head = snake[0];
  // Wall
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    return true;
  }
  // Self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// Draw canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = snakeColor;
  snake.forEach((segment, i) => {
    ctx.fillRect(segment.x, segment.y, 10, 10);
    if (i === 0) {
      ctx.fillStyle = "white";
      if (direction === "right" || direction === "left") {
        ctx.fillRect(segment.x + 3, segment.y + 2, 2, 2);
        ctx.fillRect(segment.x + 3, segment.y + 6, 2, 2);
      } else {
        ctx.fillRect(segment.x + 2, segment.y + 3, 2, 2);
        ctx.fillRect(segment.x + 6, segment.y + 3, 2, 2);
      }
      ctx.fillStyle = snakeColor;
    }
  });

  // Food
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
  ctx.fill();
}

// Game over
function gameOver() {
  clearInterval(gameInterval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }

  const playTime = Math.floor((new Date() - startTime) / 1000);
  finalScoreDisplay.textContent = `Final Score: ${score}`;
  timeDisplay.textContent = `Time: ${playTime}s`;
  snakeLengthDisplay.textContent = `Snake Length: ${snake.length}`;
  gameOverScreen.style.display = "flex";
}

// Start game
function startGame() {
  playerName = document.getElementById("playerNameInput").value.trim();
  if (!playerName) {
    alert("Please enter your name");
    return;
  }
  playerNameDisplay.textContent = `Player: ${playerName}`;
  gameSpeed = parseInt(document.getElementById("difficulty").value, 10);
  snakeColor = document.getElementById("snakeColor").value;
  startScreen.style.display = "none";
  initCanvas();
  initGame();
  gameInterval = setInterval(gameLoop, gameSpeed);
  updateDateTime();
}

// Event listeners
restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  startGame();
});
startButton.addEventListener("click", startGame);

// Keyboard controls
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (
    (key === "ArrowUp" && direction !== "down") ||
    (key === "w" && direction !== "down")
  )
    nextDirection = "up";
  else if (
    (key === "ArrowDown" && direction !== "up") ||
    (key === "s" && direction !== "up")
  )
    nextDirection = "down";
  else if (
    (key === "ArrowLeft" && direction !== "right") ||
    (key === "a" && direction !== "right")
  )
    nextDirection = "left";
  else if (
    (key === "ArrowRight" && direction !== "left") ||
    (key === "d" && direction !== "left")
  )
    nextDirection = "right";
});

// Dark mode toggle
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Date & time display
function updateDateTime() {
  const now = new Date();
  const opts = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateTimeDisplay.textContent =
    now.toLocaleDateString(undefined, opts) + " - " + now.toLocaleTimeString();
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Mobile control pad (only for touch devices)
function isMobile() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

if (isMobile()) {
  const mobileControls = document.createElement("div");
  mobileControls.id = "mobileControls";
  Object.assign(mobileControls.style, {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "grid",
    gridTemplate: "60px 60px / 60px 60px 60px",
    gap: "10px",
    zIndex: "100",
  });
  document.body.appendChild(mobileControls);

  const buttons = [
    { emoji: "⬆️", dir: "up", row: 1, col: 2 },
    { emoji: "⬅️", dir: "left", row: 2, col: 1 },
    { emoji: "➡️", dir: "right", row: 2, col: 3 },
    { emoji: "⬇️", dir: "down", row: 3, col: 2 },
  ];

  buttons.forEach(({ emoji, dir, row, col }) => {
    const btn = document.createElement("button");
    btn.textContent = emoji;
    Object.assign(btn.style, {
      fontSize: "24px",
      width: "60px",
      height: "60px",
      border: "none",
      borderRadius: "8px",
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(4px)",
      touchAction: "none",
      gridRow: row,
      gridColumn: col,
    });
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (
        (dir === "up" && direction !== "down") ||
        (dir === "down" && direction !== "up") ||
        (dir === "left" && direction !== "right") ||
        (dir === "right" && direction !== "left")
      ) {
        nextDirection = dir;
      }
    });
    mobileControls.appendChild(btn);
  });
}
