// Находим все карточки проектов
const projectCards = document.querySelectorAll('.project-card');

// Функция для проверки, в зоне видимости ли элемент
function checkVisible() {
    const triggerBottom = window.innerHeight * 0.9; // когда 90% окна
    projectCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerBottom) {
            card.classList.add('visible');
        }
    });
}

// Отслеживаем скролл
window.addEventListener('scroll', checkVisible);

// Проверка сразу после загрузки страницы
checkVisible();
