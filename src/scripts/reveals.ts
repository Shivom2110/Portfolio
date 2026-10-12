export function initReveals() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal-section]');
    if (!targets.length) return;

    if (reduceMotion) {
        targets.forEach(t => t.classList.add('is-visible'));
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(t => io.observe(t));
}
