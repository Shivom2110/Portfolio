import { initLenis } from './lenis';
import { initLiquidWord } from './liquidWord';
import { initReveals } from './reveals';
import { initCursor } from './cursor';
import { initPreloader } from './preloader';
import { initDotPortrait } from './dotPortrait';

function initSmoothAnchors(lenis: ReturnType<typeof initLenis>) {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href')?.split('#')[1];
            if (!hash) return;
            const target = document.getElementById(hash);
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(target, { offset: -20, duration: 1.2 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            history.pushState(null, '', `#${hash}`);
        });
    });
}

function boot() {
    const lenis = initLenis();
    initSmoothAnchors(lenis);
    initLiquidWord();
    initReveals();
    initCursor();
    initPreloader(lenis);
    initDotPortrait();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
