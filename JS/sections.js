const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const index = [...sections].indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.2}s`;
            entry.target.classList.remove('section-hidden');
            requestAnimationFrame(() => {
                // ждём кадр, чтобы браузер применил hidden-стили
                entry.target.classList.add('section-visible');
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => sectionObserver.observe(section));