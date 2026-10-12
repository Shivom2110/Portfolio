/**
 * Hero signature interaction: letters melt/ripple around the cursor.
 * SVG feTurbulence + feDisplacementMap, localized with a radial mask that
 * follows the pointer -- chosen over WebGL for a much smaller surface area
 * to get right and a trivial reduced-motion/touch fallback (see Phase 2
 * notes in chat for the full rationale).
 */
export function initLiquidWord() {
    const wrap = document.querySelector<HTMLElement>('[data-liquid]');
    if (!wrap) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    const fx = wrap.querySelector<HTMLElement>('.liquid-word--fx');

    if (reduceMotion || coarsePointer) {
        if (fx) fx.style.display = 'none';
        return;
    }

    const displace = document.getElementById('liquidDisplace');
    const turbulence = document.getElementById('liquidTurbulence');

    let targetR = 0;
    let currentR = 0;
    let t = 0;
    let raf = 0;

    wrap.addEventListener('pointermove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        wrap.style.setProperty('--liquid-x', mx + '%');
        wrap.style.setProperty('--liquid-y', my + '%');
    });
    wrap.addEventListener('pointerenter', () => { targetR = 230; });
    wrap.addEventListener('pointerleave', () => { targetR = 0; });

    function tick() {
        currentR += (targetR - currentR) * 0.1;
        wrap!.style.setProperty('--liquid-r', currentR.toFixed(1) + 'px');

        const scale = (currentR / 230) * 48;
        displace?.setAttribute('scale', scale.toFixed(1));

        t += 0.012;
        const bf = 0.012 + Math.sin(t) * 0.004;
        turbulence?.setAttribute('baseFrequency', `${bf.toFixed(4)} ${(bf * 1.5).toFixed(4)}`);

        raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    document.addEventListener('astro:before-swap', () => cancelAnimationFrame(raf), { once: true });
}
