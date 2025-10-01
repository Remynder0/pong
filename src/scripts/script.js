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
//canvas.width = width * 0.5;
canvas.height = height * 0.75;
console.log(width, height);

// Création des objets
let platform;
let ball;
let animationId;
let scoreInterval;
let leftPressed = false;
let rightPressed = false;

const bounce = 1.05;

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

          this.moveLeft = function (speed = 6) {
            if (this.x > 0) this.x -= speed;

            // Effet appui bouton tactile gauche
            if (leftPressed && leftButton) {
                leftButton.classList.add("translate-y-1", "scale-95", "shadow-inner");
                setTimeout(() => {
                    leftButton.classList.remove("translate-y-1", "scale-95", "shadow-inner");
                }, 100);
            }
        };

        this.moveRight = function (speed = 6) {
            if (this.x + this.width < canvas.width) this.x += speed;

            // Effet appui bouton tactile droite
            if (rightPressed && rightButton) {
                rightButton.classList.add("translate-y-1", "scale-95", "shadow-inner");
                setTimeout(() => {
                    rightButton.classList.remove("translate-y-1", "scale-95", "shadow-inner");
                }, 100);
            }
        };
    }
}

class Ball {
    constructor(color) {
        this.radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2.5;
        let angle;
        if (Math.random() < 0.5) {
            angle = (Math.random() * 90 - 115) * (Math.PI / 180);
        } else {
            angle = (Math.random() * 90 - 115 + 180) * (Math.PI / 180);
        }

        const speed = 2.5; // vitesse initiale
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
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
                this.vx = Math.min(-this.vx * bounce,5*speed);
                console.log(this.vx);
            }
            if (this.y - this.radius <= 0) {
                this.vy = Math.min(-this.vy * bounce,5*speed);
                console.log(this.vy);
            }

            // Collision avec la plateforme
            if (
                this.y + this.radius > platform.y &&
                this.x > platform.x &&
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y - this.radius;
                this.vy = Math.min(-this.vy * bounce,5*speed);
                console.log(this.vy);

            }

            // game over
            if (this.y - this.radius > canvas.height) {
                gameOver(); 
            }
        };
    }
}



// Gestion des touches
function keyDownHandler(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    }
    if (event.key === "ArrowRight") {
        rightPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    }
    if (event.key === "ArrowRight") {
        rightPressed = false;
    }
}
    

// Boucle de rendu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (leftPressed) {
        platform.moveLeft(6);
    }
    if (rightPressed) {
        platform.moveRight(6);
    }

    platform.draw();

    if(ball){
        ball.update();
        ball.draw();
    }

    animationId = requestAnimationFrame(draw);
}

// Initialisation d’une partie
function startGame() {
    // Reset partie
    cancelAnimationFrame(animationId);
    clearInterval(scoreInterval);
    ball = null;

    // Reset du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // UI
    score.style.display = "block";
    start.textContent = "Restart";
    score.textContent = "Score: 0";
    leftButton.style.display = "block";
    rightButton.style.display = "block";

    // Création des objets
    platform = new Platform((canvas.width - 100) / 2, canvas.height - 30, 100, "brown");
    ball = new Ball("green");

    // Lance le rendu
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
}



// listener

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
leftButton.addEventListener("mousedown", () => { leftPressed = true; });
leftButton.addEventListener("mouseup", () => { leftPressed = false; });
rightButton.addEventListener("mousedown", () => { rightPressed = true; });
rightButton.addEventListener("mouseup", () => { rightPressed = false; });



start.addEventListener("click", () => {
    startGame();
});