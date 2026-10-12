export function initCursor() {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarsePointer || reduceMotion) return;

    const root = document.getElementById('cursor-root');
    if (!root) return;

    const dot = document.createElement('div');
    dot.className = 'custom-cursor';
    root.appendChild(dot);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;

    window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; });

    const interactiveSelector = 'a, button, [data-cursor-grow]';
    document.addEventListener('pointerover', (e) => {
        const target = (e.target as HTMLElement)?.closest(interactiveSelector);
        dot.classList.toggle('is-grown', !!target);
    });

    function tick() {
        cx += (x - cx) * 0.18;
        cy += (y - cy) * 0.18;
        dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
