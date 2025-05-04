// --- Анимация звезд ---
const starsCanvas = document.getElementById('stars');
const starsCtx = starsCanvas.getContext('2d');

let stars = [];
const numStars = 100;

function resizeStarsCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
}

function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            radius: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

function drawStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    starsCtx.fillStyle = '#ffccff';
    for (let star of stars) {
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        starsCtx.fill();
    }
}

function updateStars() {
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > starsCanvas.height) {
            star.y = 0;
            star.x = Math.random() * starsCanvas.width;
        }
    }
}
function animateStars() {
    drawStars();
    updateStars();
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
    resizeStarsCanvas();
    createStars();
});
resizeStarsCanvas();
createStars();
animateStars();