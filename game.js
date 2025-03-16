const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0, lift: -12 };
let gravity = 0.8;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 250;
let pipeSpeed = 1;
let score = 0;
let isGameOver = false;
let isGamePaused = false;
let timer = 0;  
let gameInterval;

const bgImage = new Image();
const birdImage = new Image();
const pipeUpImage = new Image();
const pipeDownImage = new Image();

const startSound = new Audio('game-start.mp3');
const gameOverSound = new Audio('game-over.mp3');
const birdHitSound = new Audio('bird-hit.mp3');
const backGroundMusic = new Audio('game.mp3');

const instructionDot = document.getElementById('instructionDot');
const popup = document.getElementById('howToPlayPopup');
const closePopup = document.getElementById('closePopup');

bgImage.src = 'bg.png'; 
birdImage.src = 'bird.png'; 
pipeUpImage.src = 'pipeup.png'; 
pipeDownImage.src = 'pipedown.png'; 

bgImage.onload = () => {
  drawGame();  
};

birdImage.onload = () => {
  drawGame();
};

const playStartSound = () => {
    startSound.play();
};
  
const playGameOverSound = () => {
    gameOverSound.play();
};
  
const playBirdHitSound = () => {
    birdHitSound.play();
};

const playBackGroundMusic = () => {
    backGroundMusic.play();
    backGroundMusic.loop = true;
}

const drawGame = () => {

  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); 

  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height); 

  pipes.forEach(pipe => {
    ctx.drawImage(pipeUpImage, pipe.x, 0, pipeWidth, pipe.top); 
    ctx.drawImage(pipeDownImage, pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap); // Bottom pipe
  });

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);
  ctx.fillText(`Time: ${timer}s`, canvas.width - 100, 30);
};

const updateGame = () => {
  if (isGameOver) return;

  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height >= canvas.height) {
    playGameOverSound();
    isGameOver = true;
    document.getElementById('restartButton').style.display = 'block';
  }

  pipes.forEach((pipe) => {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {

      isGameOver = true;
      playBirdHitSound();
      document.getElementById('restartButton').style.display = 'block';
      clearInterval(gameInterval);
    }
  });

  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score += 1;
    }
  });

  drawGame();
  if (!isGameOver) {
    requestAnimationFrame(updateGame);
  }
};

const generatePipes = () => {

    if (pipes.length === 0) {
      pipes.push({
        x: canvas.width,
        top: 150, 
        gap: pipeGap,
      });
      pipes.push({
        x: canvas.width,
        top: 200, 
        gap: pipeGap,
      });
    } else {

      const gapBetweenPipes = 150; 
  
      const pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
      const topPipeHeight = Math.max(pipeHeight, 150); 
      const bottomPipeHeight = Math.min(canvas.height - topPipeHeight - pipeGap, canvas.height - 150); // Adjust bottom pipe height
      
      pipes.push({
        x: canvas.width + gapBetweenPipes, 
        top: topPipeHeight,
        gap: pipeGap,
      });
  
      pipes.forEach(pipe => {
        if (pipe.top + pipeGap > canvas.height) {
          pipe.top = canvas.height - pipeGap - 1; 
        }
      });
    }
  };

const flap = () => {
  if (isGameOver) return;
  bird.velocity = bird.lift;
};

const startGame = () => {
  playStartSound();
  playBackGroundMusic();
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  timer = 0;
  isGameOver = false;
  document.getElementById('restartButton').style.display = 'none';
  document.getElementById('startButton').style.display = 'none'; 
  generatePipes();
  updateGame();
  gameInterval = setInterval(() => {
    timer++;
  }, 1000);
};

function toggleMute() {
    if (isMuted) {
      backgroundMusic.play();  
      muteButton.textContent = 'Mute'; 
    } else {
      backgroundMusic.pause(); 
      muteButton.textContent = 'Unmute'; 
    }
    isMuted = !isMuted; 
}

window.onload = function () {
    playBackGroundMusic();
    const popup = document.getElementById('howToPlayPopup');
    const closeBtn = document.getElementById('closePopup');
    
    popup.style.display = 'flex';
    
    closeBtn.addEventListener('click', function () {
      popup.style.display = 'none';
    });

  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      popup.style.display = 'none'; 
      e.preventDefault();
    }
  });

  window.addEventListener('touchstart', function () {
    popup.style.display = 'none';
  });
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP') {
      togglePause();
    }
});

document.getElementById('restartButton').addEventListener('click', startGame);
document.getElementById('startButton').addEventListener('click', startGame);

instructionDot.addEventListener('click', function () {
    popup.style.display = 'block'; 
});
  
closePopup.addEventListener('click', function () {
    popup.style.display = 'none'; 
});
  
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    flap();
  }
});

window.addEventListener('click', flap);

setInterval(generatePipes, 2000);
