// Récupération des éléments du DOM
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const start = document.getElementById("startButton");
const score = document.getElementById("score");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


// Définition des dimensions du canvas
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width * 0.5;
canvas.height = height * 0.75;
console.log(width, height);

// Création des objets
let platform;
let ball;
let animationId;
let scoreInterval;

const bounce = 1.01;

class Platform {
    constructor(x, y, width, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
        this.color = color;

        this.draw = function () {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };

        this.moveLeft = function (speed = 10) {
            if (this.x > 0) {
                this.x -= speed;
            }
        };

        this.moveRight = function (speed = 10) {
            if (this.x + this.width < canvas.width) {
                this.x += speed;
            }
        };
    }
}

class Ball {
    constructor(color) {
        this.radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2.5;
        this.vx = Math.random() * (0.5 - (-0.5)) + (-0.5);
        this.vy = 3;
        this.color = color;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };

        this.update = function () {
            this.x += this.vx;
            this.y += this.vy;

            // Collision avec les murs
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                this.vx *= -bounce;
            }
            if (this.y - this.radius <= 0) {
                this.vy *= -bounce;
            }

            // Collision avec la plateforme
            if (
                this.y + this.radius > platform.y &&
                this.x > platform.x &&
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y - this.radius;
                this.vy *= -bounce;
            }

            // game over
            if (this.y - this.radius > canvas.height) {
                gameOver(); 
            }
        };
    }
}



// Gestion des touches
function platformMove(event) {
    
    if (event.key === "ArrowLeft") {
        platform.moveLeft();
    }
    if (event.key === "ArrowRight") {
        platform.moveRight();
    }
    
}

// Boucle de rendu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platform.draw();

    if(ball){
        ball.update();
        ball.draw();
    }

    animationId = requestAnimationFrame(draw);
}

// Initialisation d’une partie
function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score.style.display = "block";
    start.style.display = "none";
    score.textContent = "Score: 0";
    leftButton.style.display = "block";
    rightButton.style.display = "block";
    platform = new Platform((canvas.width - 100) / 2, canvas.height - 30, 100, "brown");
    ball = new Ball("green");
    draw();

    // compteur de score
    let s = 0;
    scoreInterval = setInterval(() => {
        s++;
        score.textContent = "Score: " + s;
    }, 1000);
}

function gameOver() {
    cancelAnimationFrame(animationId); // stop boucle animation
    clearInterval(scoreInterval); // stop compteur

    ball = null;


    ctx.fillStyle = "red";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    start.style.display = "block";
    start.textContent = "Restart";
}


// listener

document.addEventListener("keydown", platformMove);
leftButton.addEventListener("click", () => {
    platform.moveLeft();
});
rightButton.addEventListener("click", () => {
    platform.moveRight();
});



start.addEventListener("click", () => {
    startGame();
});
