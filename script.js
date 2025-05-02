const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffccff'; // розовые звёзды
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateStars() {
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

function animate() {
    drawStars();
    updateStars();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
});

resizeCanvas();
createStars();
animate();

const form = document.getElementById('contact-form');
const thankYouMessage = document.getElementById('thank-you-message');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Отменяем стандартную отправку

    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            form.reset(); // Очищаем форму
            form.style.display = 'none'; // Прячем форму
            thankYouMessage.style.display = 'block'; // Показываем сообщение
        } else {
            alert('Ошибка при отправке. Попробуйте ещё раз.');
        }
    }).catch(error => {
        alert('Ошибка сети. Попробуйте ещё раз.');
    });
});

const sections = document.querySelectorAll('section');

const revealSection = (entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-visible');
            }, index * 150);
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.15
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

const burger = document.getElementById('burger');
const nav = document.getElementById('nav-links');

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

burger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
});
overlay.addEventListener('click', closeMenu);
document.addEventListener('scroll', closeMenu);

const toTopBtn = document.getElementById('to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        toTopBtn.classList.add('show');
    } else {
        toTopBtn.classList.remove('show');
    }
});

toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
