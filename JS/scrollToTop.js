const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const fireworkCanvas = document.getElementById('fireworkCanvas');
const fireworkCtx = fireworkCanvas.getContext('2d');


let particles = [];
let explosionCenter = { x: 0, y: 0 };
let suckingStarted = false;
let explosionRunning = false;
let fireworkInProgress = false;

function resizeFireworkCanvas() {
    fireworkCanvas.width = window.innerWidth;
    fireworkCanvas.height = window.innerHeight;
}
resizeFireworkCanvas();
window.addEventListener('resize', resizeFireworkCanvas);

function createParticles(x, y) {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: x,
            y: y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 5 + 3,
            radius: Math.random() * 2 + 1,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            alpha: 1,
            spiral: 0
        });
    }
}

function updateParticles() {
    fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);

    particles.forEach((p, index) => {
        if (!suckingStarted) {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.speed *= 0.96;
        } else {
            const dx = explosionCenter.x - p.x;
            const dy = explosionCenter.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const pull = Math.min(0.08, 5 / (distance || 1));
            p.spiral += 0.3;

            p.x += pull * dx + Math.cos(p.spiral) * 2;
            p.y += pull * dy + Math.sin(p.spiral) * 2;
        }

        p.alpha *= 0.97;

        fireworkCtx.beginPath();
        fireworkCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        fireworkCtx.fillStyle = `rgba(${hslToRgb(p.color)}, ${p.alpha})`;
        fireworkCtx.fill();

        if (p.alpha < 0.05) {
            particles.splice(index, 1);
        }
    });

    if (particles.length > 0) {
        requestAnimationFrame(updateParticles);
    } else {
        explosionRunning = false;
    }
}

function hslToRgb(hsl) {
    const div = document.createElement('div');
    div.style.color = hsl;
    document.body.appendChild(div);
    const rgb = getComputedStyle(div).color.match(/\d+/g).join(',');
    document.body.removeChild(div);
    return rgb;
}

// --- Появление кнопки ---
window.addEventListener('scroll', () => {
    if (!explosionRunning && !fireworkInProgress && window.scrollY > 100) {
        scrollToTopBtn.classList.add('show');
    } else if (!explosionRunning && !fireworkInProgress) {
        scrollToTopBtn.classList.remove('show');
    }
});

// --- Нажатие на кнопку ---
scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fireworkInProgress = true;

    playFireworkSound(); // Просто вызываем
    explosionRunning = true;
    scrollToTopBtn.classList.remove('show');
    scrollToTopBtn.style.animation = 'explodeButton 1s forwards';

    const rect = scrollToTopBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    explosionCenter = { x, y };
    createParticles(x, y);

    suckingStarted = false;
    updateParticles();

    setTimeout(() => {
        suckingStarted = true;
    }, 500);

    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        scrollToTopBtn.classList.remove('show');
        scrollToTopBtn.classList.add('no-transition');
        scrollToTopBtn.style.animation = '';
        explosionRunning = false;

        setTimeout(() => {
            scrollToTopBtn.classList.remove('no-transition');

            // Пауза перед возвратом кнопки
            setTimeout(() => {
                fireworkInProgress = false;

                if (window.scrollY > 100) {
                    scrollToTopBtn.classList.add('show');
                }
            }, 2000); // пауза 2 сек
        }, 50);
    }, 1000);
}); 