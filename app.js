const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const player1NameInput = document.getElementById('player1NameInput');
    const player2NameInput = document.getElementById('player2NameInput');

    let isGameRunning = false;

    let pointMessage = { text: '', timer: 0 };


    const players = {
      player1: { name: 'Jugador 1', score: 0 },
      player2: { name: 'Jugador 2', score: 0 }
    };

    const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speed: 2.5, dx: 2.5, dy: 2.5 };
    const paddle1 = { x: 10, y: canvas.height / 2 - 50, width: 15, height: 100, dy: 4 };
    const paddle2 = { x: canvas.width - 25, y: canvas.height / 2 - 50, width: 15, height: 100, dy: 4 };

    function drawBall() { ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fillStyle = 'yellow'; ctx.fill(); ctx.closePath(); }
    function drawPaddle(x, y, width, height) { ctx.fillStyle = 'white'; ctx.fillRect(x, y, width, height); }
    function drawNet() { ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke(); ctx.setLineDash([]); }


    function drawScore() {
      ctx.fillStyle = 'white';
      ctx.font = '45px sans-serif';
      ctx.fillText(players.player1.score, canvas.width / 4, 60);
      ctx.fillText(players.player2.score, (canvas.width / 4) * 3, 60);
    }


    function drawPointMessage() {
      if (pointMessage.timer > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'yellow';
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pointMessage.text, canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'start';
      }
    }

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx *= -1;
    }

    function restartGame() {
      players.player1.score = 0;
      players.player2.score = 0;

      paddle1.y = canvas.height / 2 - 50;
      paddle2.y = canvas.height / 2 - 50;

      resetBall();
      isGameRunning = false;
      pointMessage.timer = 0;

      startButton.disabled = false;
      restartButton.disabled = true;
      player1NameInput.disabled = false;
      player2NameInput.disabled = false;
    }

    function update() {
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) { ball.dy *= -1; }
      if (ball.dx < 0 && ball.x - ball.radius < paddle1.x + paddle1.width && ball.x - ball.radius > paddle1.x && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) { ball.dx *= -1; }
      if (ball.dx > 0 && ball.x + ball.radius > paddle2.x && ball.x + ball.radius < paddle2.x + paddle2.width && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) { ball.dx *= -1; }
      if (keys.w && paddle1.y > 0) { paddle1.y -= paddle1.dy; }
      if (keys.s && paddle1.y < canvas.height - paddle1.height) { paddle1.y += paddle1.dy; }
      if (keys.ArrowUp && paddle2.y > 0) { paddle2.y -= paddle2.dy; }
      if (keys.ArrowDown && paddle2.y < canvas.height - paddle2.height) { paddle2.y += paddle2.dy; }

      if (ball.x + ball.radius > canvas.width) {
        players.player1.score++;
        pointMessage.text = `¡Punto para ${players.player1.name} HP!!!`;
        pointMessage.timer = 180;
        isGameRunning = false;
      }
      if (ball.x - ball.radius < 0) {
        players.player2.score++;
        pointMessage.text = `¡Punto para ${players.player2.name} HP!!`;
        pointMessage.timer = 180;
        isGameRunning = false;
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNet();
      drawScore();
      drawPaddle(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
      drawPaddle(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
      drawBall();


      drawPointMessage();
    }


    function gameLoop() {
      if (isGameRunning) {
        update();
      } else if (pointMessage.timer > 0) {
        pointMessage.timer--;

        if (pointMessage.timer === 0) {
          resetBall();
          isGameRunning = true;
        }
      }

      render();
      requestAnimationFrame(gameLoop);
    }

    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };
    function keyDownHandler(e) { if (e.key in keys) { keys[e.key] = true; } }
    function keyUpHandler(e) { if (e.key in keys) { keys[e.key] = false; } }
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    startButton.addEventListener('click', () => {
      players.player1.name = player1NameInput.value.trim() || 'Jugador 1';
      players.player2.name = player2NameInput.value.trim() || 'Jugador 2';

      isGameRunning = true;


      startButton.disabled = true;
      restartButton.disabled = false;
      player1NameInput.disabled = true;
      player2NameInput.disabled = true;
    });

    restartButton.addEventListener('click', restartGame);


    gameLoop();
