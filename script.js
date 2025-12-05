// Switch Page Content
function showContent(id) {
    document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* ---------------- MEMORY GAME ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    let hasFlipped = false;
    let first, second;
    let lock = false;

    function flipCard() {
        if (lock || this === first) return;
        this.classList.add("flipped");
        this.textContent = this.dataset.emoji;

        if (!hasFlipped) {
            hasFlipped = true;
            first = this;
            return;
        }

        second = this;
        checkMatch();
    }

    function checkMatch() {
        let match = first.dataset.emoji === second.dataset.emoji;
        match ? disable() : unflip();
    }

    function disable() {
        first.removeEventListener("click", flipCard);
        second.removeEventListener("click", flipCard);
        reset();
    }

    function unflip() {
        lock = true;
        setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
            first.textContent = "";
            second.textContent = "";
            reset();
        }, 800);
    }

    function reset() {
        [hasFlipped, lock] = [false, false];
        [first, second] = [null, null];
    }

    // Shuffle Cards
    (function shuffle() {
        cards.forEach(card => {
            card.style.order = Math.floor(Math.random() * 12);
        });
    })();

    cards.forEach(card => card.addEventListener("click", flipCard));
});

/* ---------------- MAZE GAME ---------------- */
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const tile = 30;
const cols = Math.floor(canvas.width / tile);
const rows = Math.floor(canvas.height / tile);
const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

let player = { x: 1, y: 1 };
let goal = { x: cols - 2, y: rows - 2 };

function createPath(x, y) {
    let stack = [[x, y]];
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[y][x] = true;

    const dir = [[0,1],[1,0],[0,-1],[-1,0]];

    while (stack.length > 0) {
        let [cx, cy] = stack.pop();
        maze[cy][cx] = 0;

        dir.sort(() => Math.random() - 0.5);

        for (let [dx, dy] of dir) {
            let nx = cx + dx * 2;
            let ny = cy + dy * 2;

            if (nx > 0 && ny > 0 && nx < cols - 1 && ny < rows - 1 && !visited[ny][nx]) {
                maze[cy + dy][cx + dx] = 0;
                maze[ny][nx] = 0;
                visited[ny][nx] = true;
                stack.push([nx, ny]);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#a9dfbf" : "#ffffff";
            ctx.fillRect(x * tile, y * tile, tile, tile);
        }
    }

    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText("👦", player.x * tile + tile/2, player.y * tile + tile/1.5);
    ctx.fillText("💚", goal.x * tile + tile/2, goal.y * tile + tile/1.5);
}

function move(e) {
    let nx = player.x;
    let ny = player.y;

    if (e.key === "ArrowUp") ny--;
    if (e.key === "ArrowDown") ny++;
    if (e.key === "ArrowLeft") nx--;
    if (e.key === "ArrowRight") nx++;

    if (maze[ny] && maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
        draw();
        if (nx === goal.x && ny === goal.y) alert("💚 Kamu berhasil!");
    }
}

document.addEventListener("keydown", move);

// MOBILE CONTROLS
document.querySelectorAll(".btn-control").forEach(btn => {
    btn.addEventListener("click", () => {
        let event = { key: "" };

        if (btn.dataset.move === "up") event.key = "ArrowUp";
        if (btn.dataset.move === "down") event.key = "ArrowDown";
        if (btn.dataset.move === "left") event.key = "ArrowLeft";
        if (btn.dataset.move === "right") event.key = "ArrowRight";

        move(event);
    });
});

createPath(1, 1);
maze[goal.y][goal.x] = 0;
draw();




