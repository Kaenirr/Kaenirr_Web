const TILT_SPAN_DEGREES = 12;

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let hovered: HTMLElement | null = null;
let cardLeft = 0;
let cardTop = 0;
let cardWidth = 1;
let cardHeight = 1;
let pointerPageX = 0;
let pointerPageY = 0;
let pendingFrame = 0;

const measureInPageSpace = (card: HTMLElement) => {
  const rect = card.getBoundingClientRect();
  cardLeft = rect.left + scrollX;
  cardTop = rect.top + scrollY;
  cardWidth = rect.width;
  cardHeight = rect.height;
};

const paint = () => {
  pendingFrame = 0;
  if (!hovered) return;
  const px = (pointerPageX - cardLeft) / cardWidth;
  const py = (pointerPageY - cardTop) / cardHeight;
  const style = hovered.style;
  style.setProperty("--mx", `${px * 100}%`);
  style.setProperty("--my", `${py * 100}%`);
  if (reducedMotion) return;
  style.setProperty("--rx", `${(px - 0.5) * TILT_SPAN_DEGREES}deg`);
  style.setProperty("--ry", `${(0.5 - py) * TILT_SPAN_DEGREES}deg`);
};

for (const card of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
  card.addEventListener("pointerenter", () => {
    hovered = card;
    measureInPageSpace(card);
    if (!reducedMotion) card.style.willChange = "transform";
  });

  card.addEventListener(
    "pointermove",
    (event) => {
      pointerPageX = event.pageX;
      pointerPageY = event.pageY;
      if (!pendingFrame) pendingFrame = requestAnimationFrame(paint);
    },
    { passive: true },
  );

  card.addEventListener("pointerleave", () => {
    if (pendingFrame) {
      cancelAnimationFrame(pendingFrame);
      pendingFrame = 0;
    }
    hovered = null;
    card.style.willChange = "";
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
  });
}

addEventListener(
  "resize",
  () => {
    if (hovered) measureInPageSpace(hovered);
  },
  { passive: true },
);
