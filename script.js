// 取得 HTML 元素
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');

let isGameRunning = false;
let score = 0;
let playerPos = 180;
let obstacles = [];
let gameLoopId;
let spawnIntervalId;
let speedMultiplier = 1;

// 1. 監聽鍵盤
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    if (e.key === 'ArrowLeft') {
        movePlayer(-20);
    } else if (e.key === 'ArrowRight') {
        movePlayer(20);
    }
});

// 2. 移動玩家
function movePlayer(offset) {
    playerPos += offset;
    if (playerPos < 0) playerPos = 0;
    if (playerPos > 360) playerPos = 360; 
    player.style.left = playerPos + 'px';
}

// 3. 創造障礙物
function createObstacle() {
    if (!isGameRunning) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.floor(Math.random() * 360) + 'px';
    obstacle.style.top = '-50px';
    
    gameContainer.appendChild(obstacle);
    obstacles.push({
        element: obstacle,
        top: -50,
        speed: 3 + Math.random() * 2 + speedMultiplier
    });
}

// 4. 遊戲迴圈
function updateGame() {
    if (!isGameRunning) return;

    speedMultiplier = 1 + (score / 500);

    obstacles.forEach((obs, index) => {
        obs.top += obs.speed;
        obs.element.style.top = obs.top + 'px';

        if (checkCollision(player, obs.element)) {
            endGame();
        }

        if (obs.top > 600) {
            obs.element.remove();
            obstacles.splice(index, 1);
            score += 10;
            scoreElement.innerText = score;
        }
    });

    gameLoopId = requestAnimationFrame(updateGame);
}

// 5. 碰撞檢測
function checkCollision(playerDiv, obstacleDiv) {
    const pRect = playerDiv.getBoundingClientRect();
    const oRect = obstacleDiv.getBoundingClientRect();

    return !(
        pRect.top > oRect.bottom ||
        pRect.right < oRect.left ||
        pRect.bottom < oRect.top ||
        pRect.left > oRect.right
    );
}

// 6. 開始遊戲
function startGame() {
    isGameRunning = true;
    score = 0;
    speedMultiplier = 1;
    scoreElement.innerText = '0';
    playerPos = 180;
    player.style.left = playerPos + 'px';
    
    obstacles.forEach(obs => obs.element.remove());
    obstacles = [];

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    updateGame();
    
    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(createObstacle, 800);
}

// 7. 結束遊戲
function endGame() {
    isGameRunning = false;
    cancelAnimationFrame(gameLoopId);
    clearInterval(spawnIntervalId);
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}