// --- Работа со звуком фейерверка ---
const fireworkSound = document.getElementById('fireworkSound');

function playFireworkSound() {
    if (fireworkSound) {
        fireworkSound.volume = 1.0;
        fireworkSound.currentTime = 0;
        fireworkSound.play().catch(e => console.warn('Autoplay prevented:', e));
    }
}
