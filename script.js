const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// 게임 설정
const PLAYER_SIZE = 30;
const SPEED = 5;
const STAR_COOLDOWN = 5000; // 5초

let player1 = { x: 100, y: 300, color: "blue", dx: 0, dy: 0 };
let player2 = { x: 600, y: 300, color: "red", dx: 0, dy: 0 };
let star = { holder: 1, x: player1.x, y: player1.y - 20, cooldown: 0 };

// 키 입력 상태
const keys = {};

// 이벤트 리스너
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// 게임 루프
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 업데이트
function update() {
    // 플레이어 이동
    if (keys["w"]) player1.dy = -SPEED;
    else if (keys["s"]) player1.dy = SPEED;
    else player1.dy = 0;

    if (keys["a"]) player1.dx = -SPEED;
    else if (keys["d"]) player1.dx = SPEED;
    else player1.dx = 0;

    if (star.cooldown === 0) {
        if (keys["ArrowUp"]) player2.dy = -SPEED;
        else if (keys["ArrowDown"]) player2.dy = SPEED;
        else player2.dy = 0;

        if (keys["ArrowLeft"]) player2.dx = -SPEED;
        else if (keys["ArrowRight"]) player2.dx = SPEED;
        else player2.dx = 0;

        if (keys["PageUp"]) {
            player2.dx *= -1;
            player2.dy *= -1;
        }
    } else {
        player2.dx = 0;
        player2.dy = 0;
        star.cooldown -= 16.67; // 약 1프레임당 16.67ms
    }

    // 위치 업데이트
    player1.x += player1.dx;
    player1.y += player1.dy;

    player2.x += player2.dx;
    player2.y += player2.dy;

    // 별 위치
    if (star.holder === 1) {
        star.x = player1.x + PLAYER_SIZE / 2;
        star.y = player1.y - 10;
    } else if (star.holder === 2) {
        star.x = player2.x + PLAYER_SIZE / 2;
        star.y = player2.y - 10;
    }

    // 충돌 감지
    if (checkCollision(player1, player2)) {
        if (star.holder === 1) {
            star.holder = 2;
            star.cooldown = STAR_COOLDOWN;
        } else if (star.holder === 2) {
            star.holder = 1;
            star.cooldown = STAR_COOLDOWN;
        }
    }
}

// 충돌 감지 함수
function checkCollision(p1, p2) {
    return (
        p1.x < p2.x + PLAYER_SIZE &&
        p1.x + PLAYER_SIZE > p2.x &&
        p1.y < p2.y + PLAYER_SIZE &&
        p1.y + PLAYER_SIZE > p2.y
    );
}

// 그리기
function draw() {
    // 화면 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어 1
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, PLAYER_SIZE, PLAYER_SIZE);

    // 플레이어 2
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, PLAYER_SIZE, PLAYER_SIZE);

    // 별
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(star.x, star.y, 10, 0, Math.PI * 2);
    ctx.fill();
}

// 게임 시작
gameLoop();
