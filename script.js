const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const SCREEN_WIDTH = 600;
        const SCREEN_HEIGHT = 600;
        const UNIT_SIZE = 25;
        const GAME_UNITS = (SCREEN_WIDTH * SCREEN_HEIGHT) / (UNIT_SIZE * UNIT_SIZE);
        const DELAY = 75;

        const gameOverSound = document.getElementById('gameOverSound');
        let x = new Array(GAME_UNITS);
        let y = new Array(GAME_UNITS);
        let bodyParts = 6;
        let applesEaten = 0;
        let appleX, appleY;
        let direction = 'D';
        let running = false;
        let gameLoop;

        function wallpaper(){
          ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                for (let row = 0; row < SCREEN_HEIGHT / UNIT_SIZE; row++) {
                    for (let col = 0; col < SCREEN_WIDTH / UNIT_SIZE; col++) {
                        ctx.fillStyle = (row + col) % 2 === 0 ? '#A2D107' : '#AAD751';
                        ctx.fillRect(col * UNIT_SIZE, row * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
                    }
                }
        }

        function initializeSnake() {
            for (let i = 0; i < bodyParts; i++) {
                x[i] = (bodyParts - i) * UNIT_SIZE;
                y[i] = 0; 
            }
        }

        function createApple() {
            appleX = Math.floor(Math.random() * (SCREEN_WIDTH / UNIT_SIZE)) * UNIT_SIZE;
            appleY = Math.floor(Math.random() * (SCREEN_HEIGHT / UNIT_SIZE)) * UNIT_SIZE;
            for (let i = 0; i < bodyParts; i++) {
                if (x[i] === appleX && y[i] === appleY) {
                    createApple();
                }
            }
        }

        function startGame() {
            bodyParts = 6;
            applesEaten = 0;
            direction = 'D';
            running = true;
            initializeSnake();
            document.addEventListener('keydown', changeDirection);
            gameLoop = setInterval(updateGame, DELAY);
            createApple();
            drawGame();
        }

        function drawGame() {
            if (running) {
                ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                for (let row = 0; row < SCREEN_HEIGHT / UNIT_SIZE; row++) {
                    for (let col = 0; col < SCREEN_WIDTH / UNIT_SIZE; col++) {
                        ctx.fillStyle = (row + col) % 2 === 0 ? '#A2D107' : '#AAD751';
                        ctx.fillRect(col * UNIT_SIZE, row * UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
                    }
                }

                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(appleX + UNIT_SIZE / 2, appleY + UNIT_SIZE / 2, UNIT_SIZE / 2, 0, Math.PI * 2);
                ctx.fill();

                for (let i = 0; i < bodyParts; i++) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(x[i], y[i], UNIT_SIZE, UNIT_SIZE);
                }

                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.fillText("Score: " + applesEaten, SCREEN_WIDTH / 2 - 40, 30);
            } else {
                gameOver();
            }
        }

        function moveSnake() {
            for (let i = bodyParts; i > 0; i--) {
                x[i] = x[i - 1];
                y[i] = y[i - 1];
            }

            switch (direction) {
                case 'W':
                    y[0] -= UNIT_SIZE;
                    break;
                case 'S':
                    y[0] += UNIT_SIZE;
                    break;
                case 'A':
                    x[0] -= UNIT_SIZE;
                    break;
                case 'D':
                    x[0] += UNIT_SIZE;
                    break;
            }
        }

        function checkAppleCollision() {
            if (x[0] === appleX && y[0] === appleY) {
                bodyParts++;
                applesEaten++;
                createApple();
            }
        }

        function checkCollisions() {
            for (let i = bodyParts; i > 0; i--) {
                if (x[0] === x[i] && y[0] === y[i]) {
                    running = false; 
                }
            }

            if (x[0] < 0 || x[0] >= SCREEN_WIDTH || y[0] < 0 || y[0] >= SCREEN_HEIGHT) {
                running = false; 
            }

            if (!running) {
                clearInterval(gameLoop);
                gameOverSound.play();
            }
        }

        function updateGame() {
            if (running) {
                moveSnake();
                checkAppleCollision();
                checkCollisions();
                drawGame();
            }
        }

        function changeDirection(event) {
            const keyPressed = event.keyCode;
            const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

            switch (keyPressed) {
                case LEFT:
                    if (direction !== 'D') {
                        direction = 'A';
                    }
                    break;
                case UP:
                    if (direction !== 'S') {
                        direction = 'W';
                    }
                    break;
                case RIGHT:
                    if (direction !== 'A') {
                        direction = 'D';
                    }
                    break;
                case DOWN:
                    if (direction !== 'W') {
                        direction = 'S';
                    }
                    break;
            }
        }

        function gameOver() {
            ctx.fillStyle = 'red';
            ctx.font = '50px Arial';
            ctx.fillText('Game Over', SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2);
            ctx.font = '30px Arial';
            ctx.fillText('Score: ' + applesEaten, SCREEN_WIDTH / 2 - 70, SCREEN_HEIGHT / 2 + 50);
        }
        wallpaper();

        document.getElementById('startButton').addEventListener('click', function() {
            const volume = document.querySelector('audio').volume;
            if (volume === 1) {
                startGame();
                document.getElementById('volumeWarning').style.display = 'none';
            } else {
                alert("Please set your device volume to maximum to play.");
            }
        });

        // On-screen control buttons for smartphones
        document.getElementById('upButton').addEventListener('click', function() {
            if (direction !== 'S') direction = 'W';
        });
        document.getElementById('downButton').addEventListener('click', function() {
            if (direction !== 'W') direction = 'S';
        });
        document.getElementById('leftButton').addEventListener('click', function() {
            if (direction !== 'D') direction = 'A';
        });
        document.getElementById('rightButton').addEventListener('click', function() {
            if (direction !== 'A') direction = 'D';
        });