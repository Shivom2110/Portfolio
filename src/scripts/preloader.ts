import type { initLenis } from './lenis';

const SESSION_KEY = 'preloader-seen';

function hasSeenPreloader(): boolean {
    try {
        return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
        return false; // storage blocked (private mode etc.) -- just show it every time
    }
}

function markPreloaderSeen() {
    try {
        sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
        /* ignore -- non-fatal if storage is unavailable */
    }
}

export function initPreloader(lenis: ReturnType<typeof initLenis>) {
    const root = document.getElementById('preloader');
    if (!root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
        root.classList.add('is-done');
        document.body.style.removeProperty('overflow');
    };

    if (hasSeenPreloader()) {
        finish();
        return;
    }

    // lock scroll (and Lenis) while the preloader runs
    document.body.style.overflow = 'hidden';
    lenis?.stop();

    const countEl = root.querySelector<HTMLElement>('[data-preloader-count]');
    const content = root.querySelector<HTMLElement>('.preloader-content');
    const ring = root.querySelector<SVGCircleElement>('[data-preloader-ring-progress]');
    const wipe = root.querySelector<HTMLElement>('[data-preloader-wipe]');
    const CIRCUMFERENCE = 264;

    const reveal = () => {
        markPreloaderSeen();
        content?.classList.add('is-hidden');
        wipe?.classList.add('is-revealing');
        window.setTimeout(() => {
            finish();
            lenis?.start();
        }, reduceMotion ? 0 : 950);
    };

    if (reduceMotion) {
        if (countEl) countEl.textContent = '100%';
        reveal();
        return;
    }

    let skipped = false;
    const skip = () => {
        if (skipped) return;
        skipped = true;
        reveal();
    };
    window.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });

    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
        if (skipped) return;
        const progress = Math.min(1, (now - start) / duration);
        const pct = Math.round(progress * 100);
        if (countEl) countEl.textContent = `${pct}%`;
        if (ring) ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            window.setTimeout(reveal, 200);
        }
    }
    requestAnimationFrame(tick);
}
