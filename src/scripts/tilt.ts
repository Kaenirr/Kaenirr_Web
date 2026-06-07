const TILT_DEGREES = 6;

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

for (const card of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", `${px * 100}%`);
    card.style.setProperty("--my", `${py * 100}%`);
    if (reducedMotion) return;
    card.style.setProperty("--rx", `${(px - 0.5) * TILT_DEGREES * 2}deg`);
    card.style.setProperty("--ry", `${(0.5 - py) * TILT_DEGREES * 2}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
}
