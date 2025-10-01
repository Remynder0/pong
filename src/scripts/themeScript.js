const body = document.body;
const select = document.getElementById('themeSelect');
const themeButtons = document.querySelectorAll('[data-theme-btn]');


// Charger le thème en mémoire locale
const saved = localStorage.getItem('pong-theme') || 'light';
body.setAttribute('data-theme', saved);
select.value = saved;


function setTheme(name) {
body.setAttribute('data-theme', name);
localStorage.setItem('pong-theme', name);


const start = document.getElementById('startButton');
start.animate([
{ transform: 'scale(1)' },
{ transform: 'scale(1.03)' },
{ transform: 'scale(1)' }
], { duration: 260 });


start.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent') || getComputedStyle(body).getPropertyValue('--accent');
start.style.color = '#fff';
const canvas = document.getElementById('gameCanvas');
canvas.style.borderColor = getComputedStyle(body).getPropertyValue('--border');


const score = document.getElementById('score');
score.style.background = getComputedStyle(body).getPropertyValue('--score-bg');
score.style.color = getComputedStyle(body).getPropertyValue('--muted');
}


select.addEventListener('change', (e) => setTheme(e.target.value));
themeButtons.forEach(btn => btn.addEventListener('click', () => {
const t = btn.getAttribute('data-theme-btn');
setTheme(t);
select.value = t;
}));


setTheme(saved);