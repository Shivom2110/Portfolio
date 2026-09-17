document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    initMobileNav();
    initScrollSpy();
    initExperienceTabs();
    initScrollReveal();
    initProjectImageFallback();
    initDotPortrait();
});

/* ---------------------------------------------------------------------- */
/* Mobile nav toggle                                                      */
/* ---------------------------------------------------------------------- */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    const close = () => {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
    };

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) close();
    });
}

/* ---------------------------------------------------------------------- */
/* Highlight the active nav link as sections scroll into view             */
/* ---------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links > a');
    if (!sections.length || !navLinks.length) return;

    const linkFor = id => document.querySelector(`.nav-links > a[href="#${id}"]`);

    const spy = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const link = linkFor(entry.target.id);
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(section => spy.observe(section));
}

/* ---------------------------------------------------------------------- */
/* Experience tabs (click + keyboard)                                     */
/* ---------------------------------------------------------------------- */
function initExperienceTabs() {
    const tabs = document.getElementById('experience-tabs');
    if (!tabs) return;

    const buttons = Array.from(tabs.querySelectorAll('.tab-button'));
    const panels = Array.from(tabs.querySelectorAll('.tab-panel'));

    const activate = index => {
        buttons.forEach((btn, i) => {
            const isActive = i === index;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
            btn.tabIndex = isActive ? 0 : -1;
        });
        panels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
    };

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => activate(index));
        btn.addEventListener('keydown', e => {
            let next = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % buttons.length;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
            if (next !== null) {
                e.preventDefault();
                buttons[next].focus();
                activate(next);
            }
        });
    });
}

/* ---------------------------------------------------------------------- */
/* Fade sections in as they enter the viewport                            */
/* ---------------------------------------------------------------------- */
function initScrollReveal() {
    const targets = document.querySelectorAll('.section');
    if (!targets.length) return;

    const reveal = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    reveal.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    targets.forEach(target => reveal.observe(target));
}

/* ---------------------------------------------------------------------- */
/* Show a placeholder icon in place of a project photo until one exists   */
/* ---------------------------------------------------------------------- */
function initProjectImageFallback() {
    document.querySelectorAll('.project-photo').forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
        }, { once: true });
    });
}

/* ---------------------------------------------------------------------- */
/* Hero dot-matrix portrait: dots scatter-assemble on load, then repel    */
/* from the cursor and spring back home -- a canvas particle system built */
/* from images/hero-portrait.json (generated from the source photo).     */
/* ---------------------------------------------------------------------- */
function initDotPortrait() {
    const canvas = document.getElementById('dot-portrait');
    if (!canvas || !canvas.getContext) return;

    const src = canvas.dataset.src;
    if (!src) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    fetch(src)
        .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
        .then(setupPortrait)
        .catch(() => { canvas.style.display = 'none'; });

    function setupPortrait(data) {
        const color = data.color || [100, 255, 218];
        const aspect = data.aspect || 4 / 3;

        const dots = data.dots.map(d => ({
            hx: d.x, hy: d.y, r: d.r, a: d.a,
            x: 0, y: 0, vx: 0, vy: 0,
            homeX: 0, homeY: 0, startX: 0, startY: 0,
            radius: 0, delay: 0, active: reduceMotion,
        }));

        let displayW = 0;
        let displayH = 0;

        // `initial`: true only for the very first layout, which also picks
        // each dot's scatter-in start position for the entrance animation.
        // A later resize just re-targets home positions in place -- physics
        // (or a straight snap for reduced motion) carries dots there smoothly
        // instead of yanking everything back out to scattered positions.
        function layout(initial) {
            const rect = canvas.getBoundingClientRect();
            displayW = rect.width;
            displayH = rect.width * aspect;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(displayW * dpr);
            canvas.height = Math.round(displayH * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            let cx = 0, cy = 0;
            dots.forEach(d => { cx += d.hx; cy += d.hy; });
            cx /= dots.length;
            cy /= dots.length;

            let maxDist = 0.0001;
            dots.forEach(d => {
                const dist = Math.hypot(d.hx - cx, d.hy - cy);
                if (dist > maxDist) maxDist = dist;
            });

            dots.forEach(d => {
                d.homeX = d.hx * displayW;
                d.homeY = d.hy * displayH;
                d.radius = d.r * displayW;

                if (!initial) return;

                const dx = d.hx - cx, dy = d.hy - cy;
                const dist = Math.hypot(dx, dy) || 0.0001;
                const nx = dx / dist, ny = dy / dist;
                const scatter = 0.12 + Math.random() * 0.22;

                d.startX = (d.hx + nx * scatter) * displayW;
                d.startY = (d.hy + ny * scatter) * displayH;
                d.delay = (dist / maxDist) * 0.5 + Math.random() * 0.35;

                if (reduceMotion) {
                    d.x = d.homeX;
                    d.y = d.homeY;
                } else {
                    d.x = d.startX;
                    d.y = d.startY;
                }
                d.vx = 0;
                d.vy = 0;
            });
        }

        function drawStatic() {
            dots.forEach(d => { d.x = d.homeX; d.y = d.homeY; d.active = true; });
            ctx.clearRect(0, 0, displayW, displayH);
            buckets.forEach((bucket, i) => {
                if (!bucket.length) return;
                ctx.beginPath();
                bucket.forEach(d => {
                    ctx.moveTo(d.x + d.radius, d.y);
                    ctx.arc(d.x, d.y, Math.max(0.01, d.radius), 0, Math.PI * 2);
                });
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${i / (BUCKETS - 1)})`;
                ctx.fill();
            });
        }

        layout(true);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                layout(false);
                if (reduceMotion) drawStatic();
            }, 150);
        });

        // bucket dots by quantized alpha so each frame does a handful of
        // fill() calls instead of one per dot
        const BUCKETS = 16;
        const buckets = Array.from({ length: BUCKETS }, () => []);
        dots.forEach(d => {
            const b = Math.min(BUCKETS - 1, Math.max(0, Math.round(d.a * (BUCKETS - 1))));
            buckets[b].push(d);
        });

        const mouse = { x: -9999, y: -9999, active: false };
        const setMouse = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = clientX - rect.left;
            mouse.y = clientY - rect.top;
            mouse.active = true;
        };
        canvas.addEventListener('mousemove', e => setMouse(e.clientX, e.clientY));
        canvas.addEventListener('mouseleave', () => { mouse.active = false; });
        canvas.addEventListener('touchmove', e => {
            if (e.touches.length) setMouse(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        canvas.addEventListener('touchend', () => { mouse.active = false; });

        const REPEL_RADIUS = 42;
        const REPEL_STRENGTH = 7;
        const SPRING = 0.09;
        const DAMPING = 0.8;
        const ENTRANCE_DURATION = 0.9;

        if (reduceMotion) {
            // respect the setting: no entrance flight, no cursor-follow ripple
            drawStatic();
            return;
        }

        const startTime = performance.now();
        let entranceDone = false;

        function frame(now) {
            const t = (now - startTime) / 1000;
            ctx.clearRect(0, 0, displayW, displayH);

            if (!entranceDone) {
                let allDone = true;
                dots.forEach(d => {
                    const p = Math.min(1, Math.max(0, (t - d.delay) / ENTRANCE_DURATION));
                    d.active = p > 0;
                    if (p < 1) allDone = false;
                    const eased = 1 - Math.pow(1 - p, 3);
                    d.x = d.startX + (d.homeX - d.startX) * eased;
                    d.y = d.startY + (d.homeY - d.startY) * eased;
                });
                if (allDone) entranceDone = true;
            } else {
                dots.forEach(d => {
                    let fx = 0, fy = 0;
                    if (mouse.active) {
                        const dx = d.x - mouse.x, dy = d.y - mouse.y;
                        const dist = Math.hypot(dx, dy);
                        if (dist < REPEL_RADIUS && dist > 0.001) {
                            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
                            fx = (dx / dist) * force;
                            fy = (dy / dist) * force;
                        }
                    }
                    d.vx = (d.vx + fx + (d.homeX - d.x) * SPRING) * DAMPING;
                    d.vy = (d.vy + fy + (d.homeY - d.y) * SPRING) * DAMPING;
                    d.x += d.vx;
                    d.y += d.vy;
                });
            }

            buckets.forEach((bucket, i) => {
                if (!bucket.length) return;
                const alpha = i / (BUCKETS - 1);
                ctx.beginPath();
                let any = false;
                bucket.forEach(d => {
                    if (!d.active) return;
                    any = true;
                    ctx.moveTo(d.x + d.radius, d.y);
                    ctx.arc(d.x, d.y, Math.max(0.01, d.radius), 0, Math.PI * 2);
                });
                if (!any) return;
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
                ctx.fill();
            });

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }
}
