var road = document.getElementById('road');
var car = document.getElementById('car');
var score = document.getElementById('score');
var gameOver = document.getElementById('game-over');
var startButton = document.getElementById('start-button');
var carSound = document.getElementById('car-sound');

var gameScore = 0;
var isGameStarted = false;
var isGameOver = false;
var roadWidth = road.offsetWidth;
var obstacleInterval;

startButton.addEventListener('click', function() {
  if (!isGameStarted) {
    startGame();
  }
});

window.addEventListener('keydown', function(event) {
  var left = parseInt(window.getComputedStyle(car).getPropertyValue('left'));

  if (isGameStarted && !isGameOver) {
    if (event.key === 'ArrowLeft') {
      moveCar(left - 10);
    } else if (event.key === 'ArrowRight') {
      moveCar(left + 10);
    }
  }
});

function startGame() {
  isGameStarted = true;
  startButton.style.display = 'none';
  carSound.play();
  obstacleInterval = setInterval(createObstacle, 2000);
  gameLoop();
}

function moveCar(left) {
  if (left >= 0 && left <= roadWidth - car.offsetWidth) {
    car.style.left = left + 'px';
  }
}

function createObstacle() {
  if (isGameStarted && !isGameOver) {
    var obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = Math.random() * (roadWidth - 60) + 'px';
    obstacle.style.top = '-60px';
    road.appendChild(obstacle);

    setTimeout(function() {
      obstacle.parentNode.removeChild(obstacle);
    }, 5000);
  }
}

function checkCollision() {
  var carRect = car.getBoundingClientRect();
  var obstacles = document.getElementsByClassName('obstacle');

  for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    var obstacleRect = obstacle.getBoundingClientRect();

    if (
      carRect.left < obstacleRect.right &&
      carRect.right > obstacleRect.left &&
      carRect.top < obstacleRect.bottom &&
      carRect.bottom > obstacleRect.top
    ) {
      return true; // Collision detected
    }
  }

  return false; // No collision detected
}

function moveObstacles() {
  var obstacles = document.getElementsByClassName('obstacle');
  for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    var top = parseInt(obstacle.style.top);
    obstacle.style.top = top + 5 + 'px';

    if (checkCollision()) {
      endGame();
      return ; // Stop checking other obstacles
    }
  }
}


function updateScore() {
  gameScore++;
  score.textContent = 'Score: ' + gameScore;
}

function endGame() {
  isGameOver = true;
  carSound.pause();
  clearInterval(obstacleInterval);
  gameOver.style.display = 'block';
}

function gameLoop() {
  if (!isGameOver) {
    moveObstacles();
    updateScore();
    requestAnimationFrame(gameLoop);
  }
}

