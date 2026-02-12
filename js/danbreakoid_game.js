const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ballImage = new Image();
ballImage.src = "../../images/danbreakoid/ball.png";

const paddleImage = new Image();
paddleImage.src = "../../images/danbreakoid/paddle.png";

let paddle = {
    width: 120,
    height: 20,
    x: canvas.width / 2 - 60,
    y: canvas.height - 30,
    speed: 10
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 10,
    dx: 4,
    dy: -4,
    onPaddle: true
};

let bricks = [];
const brickRowCount = 4;
const brickColumnCount = 10;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 60;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;
let isGameOver = false;
let isVictory = false;
let isPaused = false;
let level = 1;

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (ball.onPaddle) {
            ball.onPaddle = false;
        } else {
            isPaused = !isPaused;
        }
    }

    if (e.key === "a" || e.key === "A") {
        paddle.x -= paddle.speed;
    } else if (e.key === "d" || e.key === "D") {
        paddle.x += paddle.speed;
    }
});

canvas.addEventListener("mousemove", (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;

    if (mouseX > 0 && mouseX < canvas.width) {
        paddle.x = mouseX - paddle.width / 2;
    }
});

function constrainPaddle() {
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function drawBall() {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, 20, 20);
}

function drawPaddle() {
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBricks() {
    bricks.forEach(brick => {
        if (!brick.destroyed) {
            // Couleurs basées sur la force
            let colors = ["#2ecc71", "#e67e22", "#e74c3c", "#9b59b6"];
            ctx.fillStyle = colors[brick.strength - 1];
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            
            // Bordure pour les briques
            ctx.strokeStyle = "#black";
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
    });
}

function detectCollision(ball, brick) {
    return ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height;
}

function checkCollisions() {
    bricks.forEach(brick => {
        if (!brick.destroyed && detectCollision(ball, brick)) {
            ball.dy *= -1;
            brick.strength--;
            if (brick.strength <= 0) {
                brick.destroyed = true;
                score += 10;
            }
        }
    });

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx *= -1;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy *= -1;
    }

    if (
        ball.y + ball.dy > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        let hitPoint = ball.x - (paddle.x + paddle.width / 2);
        let angle = hitPoint / (paddle.width / 2);
        ball.dx = angle * 5;
        ball.dy = -Math.abs(ball.dy);
    }

    if (ball.y + ball.dy > canvas.height - ball.radius) {
        loseLife();
    }
}

function drawStats() {
    const scoreDiv = document.getElementById("score");
    const livesDiv = document.getElementById("lives");

    scoreDiv.innerText = `Score: ${score}`;
    livesDiv.innerHTML = "❤️".repeat(lives);

    if (lives === 1) {
        livesDiv.classList.add("critical");
    } else {
        livesDiv.classList.remove("critical");
    }

    if (score % 100 === 0 && score !== 0 && !scoreDiv.classList.contains("blinking")) {
        scoreDiv.classList.add("blinking");
        setTimeout(() => scoreDiv.classList.remove("blinking"), 1000);
    }
}

function loseLife() {
    lives--;
    if (lives > 0) {
        resetBallAndPaddle();
    } else {
        isGameOver = true;
        showGameOverAnimation();
    }
}

function resetBallAndPaddle() {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.onPaddle = true;
}

function checkWin() {
    if (bricks.every(brick => brick.destroyed)) {
        isVictory = true;
        showVictoryAnimation();
        setTimeout(() => {
            createBricks();
            resetBallAndPaddle();
            isVictory = false;
        }, 5000);
    }
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    constrainPaddle();
    drawPaddle();
    drawBall();
    drawBricks();
    drawStats();

    if (!ball.onPaddle) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        checkCollisions();
    } else {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius;
    }

    checkWin();

    if (!isGameOver && !isVictory) {
        requestAnimationFrame(draw);
    }

    if (isPaused) {
        requestAnimationFrame(draw);
        return;
    }
}

function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let strength;
            if (r === 0) strength = 3;
            else if (r === 1) strength = 2;
            else if (r === 2) strength = 1;
            else strength = 4;

            bricks.push({
                x: c * (brickWidth + brickPadding) + brickOffsetLeft,
                y: r * (brickHeight + brickPadding) + brickOffsetTop,
                width: brickWidth,
                height: brickHeight,
                strength: strength,
                destroyed: false
            });
        }
    }
}

function resizeCanvas() {
    const ratio = 1200 / 800;
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.8;

    let width = maxWidth;
    let height = width / ratio;

    if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
    }

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();



