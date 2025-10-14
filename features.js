document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("features-card-cond");
  if (!container) {
    console.warn("No #features-card-cond found in the document.");
    return;
  }

  const cards = container.querySelectorAll(".feature-card");
  if (!cards.length) return;

  const MAX_ROT = 12;      // max rotation degrees
  const SCALE_HOVER = 1.05;

  cards.forEach(card => {
    let rafId = null;

    // Ensure nice initial styles (can also be done in CSS)
    card.style.willChange = "transform";
    card.style.transition = "transform 150ms ease";
    card.style.transformStyle = "preserve-3d";

    const handleMove = (e) => {
      // Support pointer events and touch events
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX == null || clientY == null) return;

      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Normalized from -0.5 .. +0.5
      const nx = (x / rect.width) - 0.5;
      const ny = (y / rect.height) - 0.5;

      const rotateY = nx * 2 * MAX_ROT;      // left-right
      const rotateX = -ny * 2 * MAX_ROT;     // up-down (inverted)

      // Throttle using rAF for performance
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${SCALE_HOVER})`;
      });
    };

    const reset = () => {
      if (rafId) cancelAnimationFrame(rafId);
      // Smooth return
      card.style.transition = "transform 450ms cubic-bezier(.2,.9,.3,1)";
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      // reset to short transition after the animation finishes
      setTimeout(() => {
        card.style.transition = "transform 150ms ease";
      }, 500);
    };

    // Use pointer events where supported (covers mouse + touch + pen)
    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", reset);

    // extra touch support as fallback
    card.addEventListener("touchmove", handleMove, { passive: true });
    card.addEventListener("touchend", reset);
  });
});
