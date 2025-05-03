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

// --- Секции ---
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-visible');
            }, index * 150);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => sectionObserver.observe(section));

// --- Бургер ---
const burger = document.getElementById('burger');
const nav = document.getElementById('nav-links');
const overlay = document.getElementById('overlay');

function openMenu() {
    nav.classList.add('active');
    burger.classList.add('active');
    overlay.classList.add('active');
}

function closeMenu() {
    nav.classList.remove('active');
    burger.classList.remove('active');
    overlay.classList.remove('active');
}
burger.addEventListener('click', () => nav.classList.contains('active') ? closeMenu() : openMenu());
overlay.addEventListener('click', closeMenu);
document.addEventListener('scroll', closeMenu);

// --- Кнопка наверх и фейерверк ---
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const fireworkCanvas = document.getElementById('fireworkCanvas');
const fireworkCtx = fireworkCanvas.getContext('2d');
const fireworkSound = document.getElementById('fireworkSound');

let particles = [];
let explosionCenter = { x: 0, y: 0 };
let suckingStarted = false;
let explosionRunning = false;

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

function playFireworkSound() {
    const fireworkSound = document.getElementById('fireworkSound');
    if (fireworkSound) {
        fireworkSound.volume = 1.0;
        fireworkSound.currentTime = 0;
        fireworkSound.play().catch(e => console.warn('Autoplay prevented:', e));
    }
}

// --- Появление кнопки ---
window.addEventListener('scroll', () => {
    if (!explosionRunning && window.scrollY > 100) {
        scrollToTopBtn.classList.add('show');
    } else if (!explosionRunning) {
        scrollToTopBtn.classList.remove('show');
    }
});

// --- Нажатие на кнопку ---
scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();

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
        scrollToTopBtn.style.animation = '';
        explosionRunning = false; // После скролла разрешаем кнопку снова
    }, 1000);
});