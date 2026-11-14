(() => {
  "use strict";

  const lamp = document.querySelector("#idea-lamp");
  if (!lamp) return;
  const lab = lamp.closest(".idea-lab");
  const button = lamp.querySelector(".idea-switch");
  const action = lamp.querySelector(".bulb-action");
  const status = lamp.querySelector(".bulb-status");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const jokes = [
    "Idea fulminata. Niente panico: so anche riparare.",
    "Hai acceso gli straordinari. Un attimo, cambio il filamento.",
    "Troppa brillantezza tutta insieme. Ci penso io.",
    "Anche le idee hanno bisogno di manutenzione. Arrivo.",
  ];
  let state = "off";
  let switches = 0;
  let joke = 0;
  let messageTimer;
  let readyTimer;

  const setState = (next) => {
    state = next;
    lamp.dataset.state = next;
    button.setAttribute("aria-pressed", String(next === "on"));
    const busy = next === "broken" || next === "repairing";
    if (busy) button.setAttribute("aria-disabled", "true");
    else button.removeAttribute("aria-disabled");
    action.textContent = {
      off: "Accendi l’idea",
      on: "Spegni l’idea",
      broken: "Piccolo imprevisto…",
      repairing: "Ci metto le mani",
    }[next];
  };

  const breakBulb = () => {
    clearTimeout(messageTimer);
    clearTimeout(readyTimer);
    lamp.classList.remove("just-repaired");
    setState("broken");
    status.textContent = jokes[joke];
    joke = (joke + 1) % jokes.length;
    setTimeout(() => {
      setState("repairing");
      setTimeout(() => {
        switches = 0;
        setState("on");
        lamp.classList.add("just-repaired");
        status.textContent = "Ecco. Le buone idee ripartono.";
        readyTimer = setTimeout(
          () => lamp.classList.remove("just-repaired"),
          800,
        );
        messageTimer = setTimeout(() => {
          status.textContent = "Una scintilla, una prova. E si continua.";
        }, 4200);
      }, 2100);
    }, 1900);
  };

  button.addEventListener("click", () => {
    if (state === "broken" || state === "repairing") return;
    clearTimeout(messageTimer);
    clearTimeout(readyTimer);
    lamp.classList.remove("just-repaired");
    switches += 1;
    if (switches > 10) {
      breakBulb();
      return;
    }
    setState(state === "on" ? "off" : "on");
    // aria-pressed conveys ordinary toggles; the live region is for the story.
  });

  lamp.hidden = false;
  lab.classList.add("is-interactive");

  let inView = false;
  let frame;
  let pointer;
  let scrollTilt = 0;
  let lastScroll = scrollY;
  let settleTimer;
  const resetMotion = () => {
    pointer = null;
    scrollTilt = 0;
    clearTimeout(settleTimer);
    if (frame) cancelAnimationFrame(frame);
    frame = null;
    for (const property of [
      "--bulb-tilt",
      "--bulb-scroll-tilt",
      "--bulb-rise",
      "--bulb-glint",
    ])
      lamp.style.removeProperty(property);
  };
  const render = () => {
    frame = null;
    if (!inView || motion.matches) return;
    const rect = lamp.getBoundingClientRect();
    const relativeX = pointer
      ? clamp(
          (pointer.x - rect.left - rect.width / 2) / (innerWidth * 0.45),
          -1,
          1,
        )
      : 0;
    const progress = clamp(
      (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight,
      -1,
      1,
    );
    lamp.style.setProperty("--bulb-tilt", `${(relativeX * 5).toFixed(2)}deg`);
    lamp.style.setProperty("--bulb-scroll-tilt", `${scrollTilt.toFixed(2)}deg`);
    lamp.style.setProperty("--bulb-rise", `${(progress * 10).toFixed(2)}px`);
    lamp.style.setProperty("--bulb-glint", `${(relativeX * 4).toFixed(2)}px`);
  };
  const queue = () => {
    if (inView && !motion.matches && !frame)
      frame = requestAnimationFrame(render);
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      lastScroll = scrollY;
      if (inView) queue();
      else resetMotion();
    },
    { rootMargin: "80px 0px" },
  );
  observer.observe(lamp);

  window.addEventListener(
    "pointermove",
    (event) => {
      if (!inView || motion.matches || event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      queue();
    },
    { passive: true },
  );
  document.addEventListener(
    "pointerout",
    (event) => {
      if (!event.relatedTarget) {
        pointer = null;
        queue();
      }
    },
    { passive: true },
  );
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse") {
        pointer = null;
        queue();
      }
    },
    { passive: true },
  );
  window.addEventListener(
    "scroll",
    () => {
      const delta = scrollY - lastScroll;
      lastScroll = scrollY;
      if (!inView || motion.matches) return;
      scrollTilt = clamp(delta * 0.075, -3, 3);
      queue();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        scrollTilt = 0;
        queue();
      }, 140);
    },
    { passive: true },
  );
  window.addEventListener("resize", queue);
  window.addEventListener("blur", () => {
    pointer = null;
    queue();
  });
  motion.addEventListener("change", () => {
    resetMotion();
    if (!motion.matches) queue();
  });
})();
