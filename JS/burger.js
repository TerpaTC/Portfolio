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
