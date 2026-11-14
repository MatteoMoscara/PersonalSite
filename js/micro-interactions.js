(() => {
  "use strict";

  const root = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const forcedColors = matchMedia("(forced-colors: active)");
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const actionable =
    'a[href], button:not(:disabled):not([aria-disabled="true"]), summary, [role="button"]:not([aria-disabled="true"])';
  const editable =
    'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

  const layer = document.createElement("div");
  layer.className = "interaction-layer";
  const pointer = document.createElement("div");
  pointer.className = "desktop-pointer";
  pointer.hidden = true;
  pointer.setAttribute("aria-hidden", "true");
  pointer.innerHTML =
    '<span class="cursor-ring"></span><span class="cursor-core"></span>';
  const note = document.createElement("div");
  note.className = "selection-note";
  note.setAttribute("role", "status");
  note.setAttribute("aria-live", "polite");
  note.setAttribute("aria-atomic", "true");
  layer.append(pointer, note);
  document.body.append(layer);

  // A native dialog sits above every z-index. Keep the effects in its top layer.
  const syncSurface = () => {
    const surface = document.querySelector("dialog[open]") || document.body;
    if (layer.parentElement !== surface) {
      layer.querySelectorAll(".click-echo").forEach((echo) => echo.remove());
      surface.append(layer);
      queuePointers();
    }
  };
  document.querySelectorAll("dialog").forEach((dialog) => {
    new MutationObserver(syncSurface).observe(dialog, {
      attributes: true,
      attributeFilter: ["open"],
    });
    dialog.addEventListener("close", syncSurface);
  });

  const setColor = (element, target) => {
    const dark = target?.closest(
      '.photo-dialog, .outro, .field-transition[data-dark="true"]',
    );
    element.style.setProperty(
      "--effect-color",
      dark ? "var(--signal)" : "var(--accent)",
    );
  };
  let pointerFrame;
  let mousePoint;
  const placePointers = () => {
    pointerFrame = null;
    if (mousePoint && !pointer.hidden) {
      pointer.style.setProperty("--pointer-x", `${mousePoint.x}px`);
      pointer.style.setProperty("--pointer-y", `${mousePoint.y}px`);
      const hit = document.elementFromPoint(mousePoint.x, mousePoint.y);
      pointer.dataset.kind = hit?.closest(actionable)
        ? "link"
        : hit?.closest("h1, h2, h3, p, .hero-line, .hero-word")
          ? "text"
          : "idle";
      setColor(pointer, hit);
    }
  };
  const queuePointers = () => {
    if (!pointerFrame) pointerFrame = requestAnimationFrame(placePointers);
  };
  const hideMouse = () => {
    root.classList.remove("pointer-mouse");
    pointer.hidden = true;
    pointer.classList.remove("is-pressed");
    mousePoint = null;
  };
  let dragging = false;
  let press = null;
  let selectingPointer = false;

  document.addEventListener(
    "pointermove",
    (event) => {
      // Trust the actual input, including a mouse connected to a touch device.
      if (event.pointerType !== "mouse") return;
      if (
        press &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) > 7
      )
        press.moved = true;
      if (forcedColors.matches || dragging || event.target.closest(editable)) {
        hideMouse();
        return;
      }
      syncSurface();
      mousePoint = { x: event.clientX, y: event.clientY };
      // Position before hiding the native cursor, including its very first frame.
      if (pointer.hidden) {
        pointer.style.setProperty("--pointer-x", `${mousePoint.x}px`);
        pointer.style.setProperty("--pointer-y", `${mousePoint.y}px`);
      }
      pointer.hidden = false;
      root.classList.add("pointer-mouse");
      queuePointers();
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.isPrimary) selectingPointer = true;
      if (event.pointerType !== "mouse") {
        press = null;
        hideMouse();
        return;
      }
      press =
        event.button === 0
          ? {
              x: event.clientX,
              y: event.clientY,
              scroll: scrollY,
              moved: false,
              at: performance.now(),
            }
          : null;
      if (press) pointer.classList.add("is-pressed");
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerup",
    (event) => {
      if (event.isPrimary) {
        selectingPointer = false;
        scheduleSelection();
      }
      pointer.classList.remove("is-pressed");
    },
    { passive: true },
  );
  document.addEventListener(
    "pointercancel",
    () => {
      press = null;
      selectingPointer = false;
      pointer.classList.remove("is-pressed");
    },
    { passive: true },
  );
  document.addEventListener(
    "pointerout",
    (event) => {
      if (!event.relatedTarget) hideMouse();
    },
    { passive: true },
  );
  document.addEventListener("dragstart", () => {
    dragging = true;
    hideMouse();
  });
  document.addEventListener("dragend", () => {
    dragging = false;
    press = null;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" || event.key === "Escape") hideMouse();
    if (event.key === "Escape") {
      clearTimeout(selectionTimer);
      hideNote();
    }
  });

  const responses = new WeakMap();
  const activeResponses = new Set();
  const responseTarget = (event) => {
    const direct = event.target.closest(
      "h1, h2, h3, p, .text-link, .perspective-button, .portfolio-filters button, .shuffle-work, .field-story-nav button, #site-nav a, .identity, .gallery-close",
    );
    const dialog = document.querySelector("dialog[open]");
    if (direct && (!dialog || dialog.contains(direct))) return direct;
    const section = dialog || event.target.closest("section, header, footer");
    if (!section) return null;
    return [...section.querySelectorAll("h1, h2, h3")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.width &&
          rect.height &&
          rect.top < innerHeight &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.left < innerWidth
        );
      })
      .sort((a, b) => {
        const distance = (element) => {
          const rect = element.getBoundingClientRect();
          return Math.hypot(
            rect.x + rect.width / 2 - event.clientX,
            rect.y + rect.height / 2 - event.clientY,
          );
        };
        return distance(a) - distance(b);
      })[0];
  };
  document.addEventListener("click", (event) => {
    const clickPress = press;
    press = null;
    if (
      motion.matches ||
      event.detail === 0 ||
      event.pointerType === "touch" ||
      event.target.closest("[data-own-click-feedback]") ||
      !clickPress ||
      clickPress.moved ||
      performance.now() - clickPress.at > 1200 ||
      Math.abs(scrollY - clickPress.scroll) > 5 ||
      event.target.closest(editable) ||
      !getSelection()?.isCollapsed
    )
      return;

    syncSurface();
    const echo = document.createElement("span");
    echo.className = "click-echo";
    echo.setAttribute("aria-hidden", "true");
    echo.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    setColor(echo, event.target);
    layer.append(echo);
    setTimeout(() => echo.remove(), 650);

    const target = responseTarget(event);
    if (!target || typeof target.animate !== "function") return;
    responses.get(target)?.cancel();
    const rect = target.getBoundingClientRect();
    const x = clamp((rect.x + rect.width / 2 - event.clientX) * 0.025, -7, 7);
    const y = event.clientY > rect.y + rect.height / 2 ? -5 : 5;
    // Add to the current transform, so the scroll camera and reveal stay intact.
    const animation = target.animate(
      [
        { transform: "translate3d(0, 0, 0) rotate(0deg)" },
        {
          transform: `translate3d(${x}px, ${y}px, 0) rotate(${x * 0.045}deg)`,
          offset: 0.25,
        },
        {
          transform: `translate3d(${-x * 0.28}px, ${-y * 0.28}px, 0) rotate(0deg)`,
          offset: 0.62,
        },
        { transform: "translate3d(0, 0, 0) rotate(0deg)" },
      ],
      { duration: 540, easing: "cubic-bezier(.22,.8,.3,1)", composite: "add" },
    );
    responses.set(target, animation);
    activeResponses.add(animation);
    animation.finished
      .catch(() => {})
      .finally(() => activeResponses.delete(animation));
  });

  const phrases = [
    "Dai non selezionarmi",
    "Mi hai preso in parola.",
    "Un attimo: mi fai il solletico.",
    "Ok, questa frase ti ha colpito.",
    "Mi sento un po’ evidenziato.",
    "Anche le parole vogliono muoversi.",
    "Hai trovato qualcosa da tenere?",
    "Questa te la vuoi proprio ricordare.",
    "Le idee lasciano il segno, eh?",
    "Prendi pure spunto. Poi parliamone.",
  ];
  let phraseIndex = 0;
  let selectionTimer;
  let noteTimer;
  let clearNoteTimer;
  let lastShown = null;
  const hideNote = () => {
    clearTimeout(noteTimer);
    clearTimeout(clearNoteTimer);
    note.dataset.visible = "false";
    clearNoteTimer = setTimeout(
      () => {
        note.textContent = "";
      },
      motion.matches ? 0 : 180,
    );
  };
  const readSelection = () => {
    const selection = getSelection();
    if (
      !selection ||
      selection.isCollapsed ||
      !selection.rangeCount ||
      !selection.toString().trim()
    )
      return null;
    const range = selection.getRangeAt(0);
    const ancestor = range.commonAncestorContainer;
    const element =
      ancestor.nodeType === Node.ELEMENT_NODE
        ? ancestor
        : ancestor.parentElement;
    if (
      !element?.closest("main, .site-header, .site-footer, .photo-dialog") ||
      element.closest(editable) ||
      layer.contains(element)
    )
      return null;
    return {
      anchor: selection.anchorNode,
      start: selection.anchorOffset,
      focus: selection.focusNode,
      end: selection.focusOffset,
      text: selection.toString(),
      range,
    };
  };
  const sameSelection = (a, b) =>
    a &&
    b &&
    a.anchor === b.anchor &&
    a.start === b.start &&
    a.focus === b.focus &&
    a.end === b.end &&
    a.text === b.text;
  function scheduleSelection() {
    clearTimeout(selectionTimer);
    const selection = readSelection();
    if (!selection) {
      lastShown = null;
      hideNote();
      return;
    }
    if (sameSelection(selection, lastShown)) return;
    hideNote();
    if (selectingPointer) return;
    selectionTimer = setTimeout(() => {
      const current = readSelection();
      if (selectingPointer || !sameSelection(current, selection)) return;
      const rects = [...current.range.getClientRects()].filter(
        (rect) =>
          rect.width &&
          rect.height &&
          rect.bottom > 0 &&
          rect.top < innerHeight &&
          rect.right > 0 &&
          rect.left < innerWidth,
      );
      const rect = rects.at(-1);
      if (!rect) return;
      syncSurface();
      clearTimeout(clearNoteTimer);
      note.textContent = phrases[phraseIndex];
      phraseIndex = (phraseIndex + 1) % phrases.length;
      const size = note.getBoundingClientRect();
      const center = clamp(
        rect.x + rect.width / 2,
        size.width / 2 + 16,
        innerWidth - size.width / 2 - 16,
      );
      const below = rect.bottom + 12;
      const top =
        below + size.height < innerHeight - 16
          ? below
          : rect.top - size.height - 12;
      note.style.left = `${center}px`;
      note.style.top = `${clamp(top, 16, Math.max(16, innerHeight - size.height - 16))}px`;
      note.dataset.visible = "true";
      lastShown = current;
      noteTimer = setTimeout(hideNote, 3600);
    }, 1000);
  }
  document.addEventListener("selectionchange", scheduleSelection);
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(selectionTimer);
      if (note.dataset.visible === "true") hideNote();
      if (mousePoint) queuePointers();
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    clearTimeout(selectionTimer);
    hideNote();
  });
  const resetInput = () => {
    press = null;
    selectingPointer = false;
    hideMouse();
    clearTimeout(selectionTimer);
    hideNote();
  };
  window.addEventListener("blur", resetInput);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetInput();
  });
  forcedColors.addEventListener("change", hideMouse);
  motion.addEventListener("change", () => {
    if (!motion.matches) return;
    activeResponses.forEach((animation) => animation.cancel());
    layer.querySelectorAll(".click-echo").forEach((echo) => echo.remove());
  });
})();
