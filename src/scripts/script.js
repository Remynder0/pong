const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const start = document.getElementById("startButton");
const score = document.getElementById("score");

const gravity = 0.5;
const bounce = 0.7;

class Platform {
    constructor(x, y, width, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
        this.vy = 0; // vitesse verticale
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
        this.radius = 20;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2.5;
        this.color = color;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };
         this.update = function() {
            this.vy += gravity;   
            this.y += this.vy;    

            // Collision avec le sol
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
                this.vy *= -bounce; // rebond
            }
        };
    }
}

// Création des objets
let platform = new Platform((canvas.width - 100) / 2, canvas.height - 30, 100, "brown");
let ball = new Ball("green");

// Gestion des touches
function platformMove() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            console.log("Flèche gauche pressée");
            platform.moveLeft();
        }
        if (event.key === "ArrowRight") {
            console.log("Flèche droite pressée");
            platform.moveRight();
        }
    });
}

// Boucle de rendu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface l’écran
    platform.draw();
    ball.update();
    ball.draw();
    requestAnimationFrame(draw);
}

start.addEventListener("click", () => {
    console.log("Start button clicked");
    score.style.display = "block";
    start.style.display = "none";
    platformMove();
    draw();
});
