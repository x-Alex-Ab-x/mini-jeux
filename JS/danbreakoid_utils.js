function detectCollision(ball, brick) {
    return (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
    );
}

function getRandomAngle() {
    const angle = (Math.random() * Math.PI) / 2 + Math.PI / 4;
    return {
        x: Math.cos(angle),
        y: -Math.sin(angle)
    };
}

