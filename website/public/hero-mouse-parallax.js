(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const preview = document.querySelector('.platform-preview');
  if (!hero || !preview) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reducedMotion || !finePointer || window.innerWidth <= 900) return;

  let raf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let hovering = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const render = () => {
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;

    const rotateY = -8 + currentX * 7;
    const rotateX = 3 - currentY * 5;
    const translateX = currentX * 10;
    const translateY = currentY * 8 - (hovering ? 8 : 0);
    const translateZ = hovering ? 34 : 18;

    preview.style.transform = `perspective(1500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
    preview.style.setProperty('--mouse-x', `${50 + currentX * 22}%`);
    preview.style.setProperty('--mouse-y', `${50 + currentY * 18}%`);

    const settled = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
    if (!settled || hovering) raf = requestAnimationFrame(render);
    else raf = 0;
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
    targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
    hovering = true;
    schedule();
  });

  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    hovering = false;
    schedule();
  });

  preview.addEventListener('pointerenter', () => {
    hovering = true;
    schedule();
  });

  preview.addEventListener('pointerleave', () => {
    hovering = false;
    schedule();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) preview.style.removeProperty('transform');
  });
})();
