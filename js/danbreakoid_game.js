/* DanBreakoid - Game Logic (avec power-ups) */

(() => {
  // =========================================================
  // Canvas / Context
  // =========================================================
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // =========================================================
  // Assets (chemins GitHub Pages)
  // =========================================================
  const ballImage = new Image();
  ballImage.src = "../images/danbreakoid/ball.png";

  const paddleImage = new Image();
  paddleImage.src = "../images/danbreakoid/paddle.png";

  // (optionnel) autres balles si tu veux les utiliser plus tard
  // const ball2Image = new Image(); ball2Image.src = "../images/danbreakoid/ball2.png";
  // const ball3Image = new Image(); ball3Image.src = "../images/danbreakoid/ball3.png";

  // =========================================================
  // Game State
  // =========================================================
  let score = 0;
  let lives = 3;
  let level = 1;

  // =========================================================
  // Paddle
  // =========================================================
  const paddle = {
    width: 120,
    height: 20,
    x: canvas.width / 2 - 60,
    y: canvas.height - 40,
    speed: 7,
    dx: 0,
  };

  // largeur normale (pour revenir à la normale après un power-up)
  let paddleBaseWidth = paddle.width;

  // =========================================================
  // Ball
  // =========================================================
  const ball = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    radius: 10,
    dx: 4,
    dy: -4,
    onPaddle: true, // au départ la balle est "posée" sur la raquette
  };

  // =========================================================
  // Bricks
  // =========================================================
  const brickConfig = {
    rows: 5,
    cols: 10,
    width: 70,
    height: 22,
    padding: 10,
    offsetTop: 70,
    offsetLeft: 35,
  };

  let bricks = [];

  function createBricks() {
    bricks = [];
    for (let r = 0; r < brickConfig.rows; r++) {
      for (let c = 0; c < brickConfig.cols; c++) {
        bricks.push({
          x:
            brickConfig.offsetLeft +
            c * (brickConfig.width + brickConfig.padding),
          y:
            brickConfig.offsetTop +
            r * (brickConfig.height + brickConfig.padding),
          width: brickConfig.width,
          height: brickConfig.height,
          destroyed: false,
          strength: 1, // tu peux monter à 2-3 si tu veux des briques plus fortes
        });
      }
    }
  }

  createBricks();

  // =========================================================
  // Power-Ups
  // =========================================================
  const POWER_TYPES = {
    BIG_PADDLE: "big_paddle",
    FIRE_BALL: "fire_ball",
  };

  let powerUps = [];

  let fireBallActive = false;
  let fireBallTimer = null;
  let bigPaddleTimer = null;

  function maybeDropPowerUp(x, y) {
    const chance = 0.25; // 25% de chance
    if (Math.random() > chance) return;

    const types = [POWER_TYPES.BIG_PADDLE, POWER_TYPES.FIRE_BALL];
    const type = types[Math.floor(Math.random() * types.length)];

    powerUps.push({
      type,
      x,
      y,
      w: 28,
      h: 28,
      vy: 2.5,
      active: true,
    });
  }

  function activatePowerUp(type) {
    if (type === POWER_TYPES.BIG_PADDLE) {
      paddle.width = Math.min(paddleBaseWidth * 1.6, 240);

      clearTimeout(bigPaddleTimer);
      bigPaddleTimer = setTimeout(() => {
        paddle.width = paddleBaseWidth;
      }, 10000);
    }

    if (type === POWER_TYPES.FIRE_BALL) {
      fireBallActive = true;

      clearTimeout(fireBallTimer);
      fireBallTimer = setTimeout(() => {
        fireBallActive = false;
      }, 8000);
    }
  }

  function updatePowerUps() {
    for (const p of powerUps) {
      if (!p.active) continue;

      p.y += p.vy;

      // collision avec la raquette
      const paddleLeft = paddle.x;
      const paddleRight = paddle.x + paddle.width;
      const paddleTop = paddle.y;

      const pLeft = p.x - p.w / 2;
      const pRight = p.x + p.w / 2;
      const pBottom = p.y + p.h / 2;

      if (
        pBottom >= paddleTop &&
        pRight >= paddleLeft &&
        pLeft <= paddleRight
      ) {
        p.active = false;
        activatePowerUp(p.type);
      }

      // hors écran
      if (p.y > canvas.height + 50) p.active = false;
    }

    powerUps = powerUps.filter((p) => p.active);
  }

  function drawPowerUps() {
    for (const p of powerUps) {
      if (!p.active) continue;

      ctx.save();
      ctx.fillStyle = p.type === POWER_TYPES.BIG_PADDLE ? "gold" : "orangered";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // =========================================================
  // Input
  // =========================================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;

    // Espace : lancer la balle si elle est sur la raquette
    if (e.key === " " || e.code === "Space") {
      if (ball.onPaddle) ball.onPaddle = false;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = 0;
    if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = 0;
  });

  // clic pour lancer (si tu veux)
  canvas.addEventListener("click", () => {
    if (ball.onPaddle) ball.onPaddle = false;
  });

  // =========================================================
  // Drawing
  // =========================================================
  function drawPaddle() {
    ctx.drawImage(paddleImage, paddle.x, paddle.y, paddle.width, paddle.height);
  }

  function drawBall() {
    // effet visuel si fireball
    if (fireBallActive) {
      ctx.save();
      ctx.shadowColor = "orangered";
      ctx.shadowBlur = 18;
      ctx.drawImage(
        ballImage,
        ball.x - ball.radius,
        ball.y - ball.radius,
        20,
        20,
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        ballImage,
        ball.x - ball.radius,
        ball.y - ball.radius,
        20,
        20,
      );
    }
  }

  function drawBricks() {
    bricks.forEach((brick) => {
      if (brick.destroyed) return;

      ctx.fillStyle = "#6b5b95";
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      // petite bordure
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    });
  }

  function drawStats() {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 18, 28);
    ctx.fillText(`Vies: ${lives}`, 140, 28);
    ctx.fillText(`Niveau: ${level}`, 240, 28);

    if (fireBallActive) ctx.fillText("🔥 Fireball", 360, 28);
    if (paddle.width > paddleBaseWidth) ctx.fillText("📏 Barre+", 470, 28);

    ctx.restore();
  }

  // =========================================================
  // Collision Helpers
  // =========================================================
  function circleRectCollision(circle, rect) {
    // closest point on rect to circle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  // =========================================================
  // Collisions
  // =========================================================
  function checkCollisions() {
    // walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy *= -1;
    }

    // bottom (lose life)
    if (ball.y + ball.radius > canvas.height) {
      lives--;
      if (lives <= 0) {
        resetGame(true);
        return;
      }
      resetBallOnPaddle();
      return;
    }

    // paddle
    const paddleRect = {
      x: paddle.x,
      y: paddle.y,
      width: paddle.width,
      height: paddle.height,
    };

    if (!ball.onPaddle && circleRectCollision(ball, paddleRect)) {
      // reposition above paddle
      ball.y = paddle.y - ball.radius - 1;
      ball.dy = -Math.abs(ball.dy);

      // angle effect depending on hit position
      const hitPos =
        (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dx = hitPos * 5; // ajuste la force horizontale
    }

    // bricks
    for (const brick of bricks) {
      if (brick.destroyed) continue;

      if (circleRectCollision(ball, brick)) {
        brick.strength--;

        if (brick.strength <= 0) {
          brick.destroyed = true;
          score += 10;

          // ✅ drop power-up (centre de la brique)
          maybeDropPowerUp(
            brick.x + brick.width / 2,
            brick.y + brick.height / 2,
          );
        }

        // rebond normal seulement si pas fireball
        if (!fireBallActive) {
          ball.dy *= -1;
        }

        break; // évite plusieurs collisions en 1 frame
      }
    }

    // next level?
    if (bricks.every((b) => b.destroyed)) {
      level++;
      resetBallOnPaddle();
      createBricks();
      // option: accélérer un peu
      ball.dx *= 1.05;
      ball.dy *= 1.05;
    }
  }

  // =========================================================
  // Reset Helpers
  // =========================================================
  function resetBallOnPaddle() {
    ball.onPaddle = true;
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - 25;
    ball.dx = 4;
    ball.dy = -4;
  }

  function resetGame(fullReset) {
    // fullReset = true si game over
    if (fullReset) {
      score = 0;
      lives = 3;
      level = 1;
    }

    // désactiver power-ups
    fireBallActive = false;
    clearTimeout(fireBallTimer);
    clearTimeout(bigPaddleTimer);

    paddle.width = paddleBaseWidth;
    createBricks();
    resetBallOnPaddle();
    powerUps = [];
  }

  // =========================================================
  // Update / Draw Loop
  // =========================================================
  function update() {
    // move paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width)
      paddle.x = canvas.width - paddle.width;

    // ball follow paddle if onPaddle
    if (ball.onPaddle) {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - 25;
    } else {
      ball.x += ball.dx;
      ball.y += ball.dy;
      checkCollisions();
      updatePowerUps();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawPaddle();
    drawBall();
    drawPowerUps();
    drawStats();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // start
  resetBallOnPaddle();
  loop();
})();
