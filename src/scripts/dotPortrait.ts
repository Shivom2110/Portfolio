/**
 * Dot-matrix portrait for the About card: scattered dots assemble into the
 * photo once the card scrolls into view, then -- same as the original
 * version of this effect -- dots near the cursor spring away and settle
 * back, rather than the whole canvas zooming on hover.
 */
export function initDotPortrait() {
    const canvas = document.querySelector<HTMLCanvasElement>('[data-dot-portrait]');
    if (!canvas || !canvas.getContext) return;

    const src = canvas.dataset.src;
    if (!src) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    fetch(src)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
        .then(setup)
        .catch(() => {
            canvas.style.display = 'none';
        });

    function setup(data: { aspect: number; color: number[]; dots: { x: number; y: number; r: number; a: number }[] }) {
        // Override the baked-in color from the source JSON (teal, from the
        // previous site's palette) with this site's gold accent, read from
        // the canvas's own data attribute so it stays themeable without
        // regenerating the dot data.
        const colorAttr = canvas!.dataset.color;
        const color = colorAttr ? colorAttr.split(',').map(Number) : (data.color ?? [194, 165, 110]);
        const aspect = data.aspect ?? 4 / 3;

        const dots = data.dots.map((d) => ({
            hx: d.x, hy: d.y, r: d.r, a: d.a,
            x: 0, y: 0, vx: 0, vy: 0,
            homeX: 0, homeY: 0, startX: 0, startY: 0,
            radius: 0, delay: 0, active: reduceMotion,
        }));

        let displayW = 0;
        let displayH = 0;

        function layout() {
            const rect = canvas!.getBoundingClientRect();
            displayW = rect.width;
            displayH = rect.width * aspect;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas!.width = Math.round(displayW * dpr);
            canvas!.height = Math.round(displayH * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            let cx = 0, cy = 0;
            dots.forEach((d) => { cx += d.hx; cy += d.hy; });
            cx /= dots.length; cy /= dots.length;

            let maxDist = 0.0001;
            dots.forEach((d) => {
                const dist = Math.hypot(d.hx - cx, d.hy - cy);
                if (dist > maxDist) maxDist = dist;
            });

            dots.forEach((d) => {
                d.homeX = d.hx * displayW;
                d.homeY = d.hy * displayH;
                d.radius = d.r * displayW;

                const dx = d.hx - cx, dy = d.hy - cy;
                const dist = Math.hypot(dx, dy) || 0.0001;
                const nx = dx / dist, ny = dy / dist;
                const scatter = 0.12 + Math.random() * 0.22;

                d.startX = (d.hx + nx * scatter) * displayW;
                d.startY = (d.hy + ny * scatter) * displayH;
                d.delay = (dist / maxDist) * 0.5 + Math.random() * 0.35;

                d.x = reduceMotion ? d.homeX : d.startX;
                d.y = reduceMotion ? d.homeY : d.startY;
                d.vx = 0;
                d.vy = 0;
            });
        }

        layout();
        let resizeTimer: ReturnType<typeof setTimeout>;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(layout, 150);
        });

        const BUCKETS = 16;
        const buckets: (typeof dots)[number][][] = Array.from({ length: BUCKETS }, () => []);
        dots.forEach((d) => {
            const b = Math.min(BUCKETS - 1, Math.max(0, Math.round(d.a * (BUCKETS - 1))));
            buckets[b].push(d);
        });

        function drawFrame() {
            ctx!.clearRect(0, 0, displayW, displayH);
            buckets.forEach((bucket, i) => {
                if (!bucket.length) return;
                ctx!.beginPath();
                let any = false;
                bucket.forEach((d) => {
                    if (!d.active) return;
                    any = true;
                    ctx!.moveTo(d.x + d.radius, d.y);
                    ctx!.arc(d.x, d.y, Math.max(0.01, d.radius), 0, Math.PI * 2);
                });
                if (!any) return;
                ctx!.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${i / (BUCKETS - 1)})`;
                ctx!.fill();
            });
        }

        if (reduceMotion) {
            dots.forEach((d) => { d.active = true; });
            drawFrame();
            return;
        }

        // Mouse-repel setup (skipped on touch devices -- there's no hover there)
        const mouse = { x: -9999, y: -9999, active: false };
        if (!coarsePointer) {
            const setMouse = (clientX: number, clientY: number) => {
                const rect = canvas!.getBoundingClientRect();
                mouse.x = clientX - rect.left;
                mouse.y = clientY - rect.top;
                mouse.active = true;
            };
            canvas!.addEventListener('pointermove', (e) => setMouse(e.clientX, e.clientY));
            canvas!.addEventListener('pointerleave', () => { mouse.active = false; });
        }
        const REPEL_RADIUS = 34;
        const REPEL_STRENGTH = 6;
        const SPRING = 0.09;
        const DAMPING = 0.8;

        let entranceDone = false;
        let started = false;
        const ENTRANCE_DURATION = 0.9;
        let startTime = 0;

        function tick(now: number) {
            const t = (now - startTime) / 1000;

            if (!entranceDone) {
                let allDone = true;
                dots.forEach((d) => {
                    const p = Math.min(1, Math.max(0, (t - d.delay) / ENTRANCE_DURATION));
                    d.active = p > 0;
                    if (p < 1) allDone = false;
                    const eased = 1 - Math.pow(1 - p, 3);
                    d.x = d.startX + (d.homeX - d.startX) * eased;
                    d.y = d.startY + (d.homeY - d.startY) * eased;
                });
                if (allDone) entranceDone = true;
            } else {
                dots.forEach((d) => {
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

            drawFrame();
            requestAnimationFrame(tick);
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !started) {
                        started = true;
                        startTime = performance.now();
                        requestAnimationFrame(tick);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        io.observe(canvas!);
    }
}
