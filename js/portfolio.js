(() => {
  "use strict";

  const content = window.PORTFOLIO_CONTENT;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  const storage = {
    get(key) {
      try {
        return JSON.parse(sessionStorage.getItem(`mm:${key}`));
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        sessionStorage.setItem(`mm:${key}`, JSON.stringify(value));
      } catch {
        /* The experience also works without storage. */
      }
    },
  };
  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  // A new opening on each visit; the typography and voice stay consistent.
  const previousOpening = storage.get("opening");
  let openingIndex = Math.floor(Math.random() * content.openings.length);
  if (openingIndex === previousOpening)
    openingIndex =
      (openingIndex +
        1 +
        Math.floor(Math.random() * (content.openings.length - 1))) %
      content.openings.length;
  storage.set("opening", openingIndex);
  const opening = content.openings[openingIndex];
  const edition = window.PORTFOLIO_COPY?.[opening.id];
  if (edition) {
    document.documentElement.dataset.edition = opening.id;
    const template = document.createElement("template");
    document.querySelectorAll("[data-copy]").forEach((element) => {
      const copy = edition[element.dataset.copy];
      if (typeof copy !== "string") return;
      // Editorial markup comes only from the bundled, maintained copy file.
      // Keep the existing decorative arrows on links and buttons.
      const decorations = [...element.children].filter((child) =>
        child.matches('[aria-hidden="true"]'),
      );
      template.innerHTML = copy;
      element.replaceChildren(template.content.cloneNode(true), ...decorations);
    });
  }
  const heroTitle = document.querySelector("#hero-title");
  const lines = opening.lines.map((line, i) => {
    const span = document.createElement("span");
    span.className = i === 2 ? "hero-word" : "hero-line";
    span.textContent = line;
    if (i === 2) {
      const period = document.createElement("span");
      period.className = "hero-period";
      period.textContent = ".";
      span.append(period);
    }
    return span;
  });
  heroTitle.replaceChildren(...lines);
  const longestLine = Math.max(...opening.lines.map((line) => line.length));
  heroTitle.style.setProperty(
    "--headline-scale",
    String(longestLine > 10 ? 10 / longestLine : 1),
  );
  document.querySelector(".hero-aside").textContent = opening.aside;
  document.querySelector(".hero-photo figcaption span").textContent =
    opening.note;
  const thought = document.querySelector("#work-thought");
  const thoughtSecond = document.createElement("span");
  thoughtSecond.textContent = opening.thought[1];
  thought.replaceChildren(
    document.createTextNode(opening.thought[0]),
    document.createElement("br"),
    thoughtSecond,
  );

  const previousPalette = storage.get("palette");
  let paletteIndex = Math.floor(Math.random() * content.palettes.length);
  if (paletteIndex === previousPalette) {
    paletteIndex =
      (paletteIndex +
        1 +
        Math.floor(Math.random() * (content.palettes.length - 1))) %
      content.palettes.length;
  }
  storage.set("palette", paletteIndex);
  const palette = content.palettes[paletteIndex];
  document.documentElement.dataset.palette = palette.id;
  for (const [property, value] of Object.entries({
    "--accent": palette.accent,
    "--accent-link": palette.link,
    "--signal": palette.signal,
    "--on-accent": palette.onAccent,
    "--outro-em": palette.outroEm,
    "--accent-line": `${palette.onAccent}55`,
  }))
    document.documentElement.style.setProperty(property, value);

  let revealObserver;
  const observeReveals = (root = document) =>
    root.querySelectorAll(".reveal").forEach((element) => {
      if (revealObserver) revealObserver.observe(element);
      else element.classList.add("is-visible");
    });

  const grid = document.querySelector("#portfolio-grid");
  let activeFilter = "all";
  let visiblePhotos = [];
  let mixedSelection = [];
  const selectionKey = (items) =>
    items
      .map((item) => item.id)
      .sort()
      .join("|");
  const newSelection = () => {
    const websites = shuffle(content.websites).slice(0, 3);
    const photos = shuffle(content.photos).slice(0, 3);
    const selected = [...websites, ...photos];
    if (selectionKey(selected) === storage.get("selection")) {
      photos[2] = content.photos.find(
        (photo) => !photos.some((item) => item.id === photo.id),
      );
    }
    const firstPhotos = Math.random() < 0.5;
    mixedSelection = websites.flatMap((site, index) =>
      firstPhotos ? [photos[index], site] : [site, photos[index]],
    );
    storage.set("selection", selectionKey(mixedSelection));
  };
  const websiteMarkup = (
    site,
  ) => `<article class="work-item website-work reveal" data-work-id="${site.id}" data-kind="web">
    <a class="work-visual site-visual" href="${site.url}" target="_blank" rel="noopener noreferrer" aria-label="Visita ${escape(site.title)}, si apre in una nuova scheda">
      <div class="work-image site-preview" style="--site-tint:${site.color}"><div class="browser-window"><div class="browser-topline" aria-hidden="true"><span class="browser-dots">● ● ●</span><span>${site.domain}</span><span>↗</span></div><img src="${site.image}" width="1200" height="800" alt="Anteprima del sito ${escape(site.title)}" loading="lazy"></div><span class="work-open" aria-hidden="true">↗</span></div>
      <div class="work-caption"><h3>${escape(site.title)}</h3><span>${escape(site.subtitle)}</span></div>
    </a><p class="website-description">${escape(site.description)}</p>
    ${site.platforms ? `<p class="app-platforms"><span>Web</span>${site.platforms.map((platform) => `<span>${platform}</span>`).join("")}</p>` : ""}
    ${site.apps ? `<div class="app-links"><a href="${site.apps.android}" target="_blank" rel="noopener noreferrer" aria-label="MeTe su Google Play, nuova scheda">Google Play <span aria-hidden="true">&#8599;</span></a><a href="${site.apps.ios}" target="_blank" rel="noopener noreferrer" aria-label="MeTe su App Store, nuova scheda">App Store <span aria-hidden="true">&#8599;</span></a></div>` : ""}
    </article>`;
  const photoMarkup = (
    photo,
  ) => `<article class="work-item photography-work reveal" data-work-id="${photo.id}" data-kind="photo">
    <button class="photo-work work-visual" type="button" data-photo="${photo.id}" aria-label="Apri a tutto schermo: ${escape(photo.title)}">
      <span class="work-image photography-preview"><img src="img/photography/${photo.id}-anteprima.webp" width="850" height="${Math.round((850 * photo.height) / photo.width)}" alt="${escape(photo.alt)}" loading="lazy"><span class="work-open" aria-hidden="true">＋</span></span>
      <span class="work-caption"><span class="photo-title">${escape(photo.title)}</span><span>Archivio personale / Fotografia</span></span>
    </button></article>`;
  const renderPortfolio = (announce = false) => {
    const items =
      activeFilter === "web"
        ? shuffle(content.websites)
        : activeFilter === "photo"
          ? shuffle(content.photos)
          : mixedSelection;
    visiblePhotos = items.filter((item) => !item.url);
    if (revealObserver)
      grid
        .querySelectorAll(".reveal")
        .forEach((element) => revealObserver.unobserve(element));
    grid.innerHTML = items
      .map((item) => (item.url ? websiteMarkup(item) : photoMarkup(item)))
      .join("");
    grid.dataset.view = activeFilter;
    observeReveals(grid);
    document
      .querySelectorAll(".portfolio-filters button[data-filter]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.filter === activeFilter),
        ),
      );
    if (announce) {
      const webCount = items.length - visiblePhotos.length;
      document.querySelector("#portfolio-status").textContent =
        `Nella selezione: ${items.length} lavori, ${webCount} siti web e ${visiblePhotos.length} fotografie.`;
    }
  };
  newSelection();
  renderPortfolio();
  document.querySelector(".portfolio-toolbar").hidden = false;
  document
    .querySelectorAll(".portfolio-filters button[data-filter]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        renderPortfolio(true);
      }),
    );
  document.querySelector(".shuffle-work").addEventListener("click", () => {
    newSelection();
    renderPortfolio(true);
  });

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    document.documentElement.classList.add("motion-ready");
    // Initial cards were inserted before the observer was available.
    grid
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.remove("is-visible"));
    observeReveals();
  }

  // The menu remains a normal, visible navigation when JavaScript is absent.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  const mobile = matchMedia("(max-width: 760px)");
  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    navigation.inert = mobile.matches && !open;
    document.querySelector("main").inert = open;
    document.querySelector(".site-footer").inert = open;
  };
  const syncMenu = () => {
    document.documentElement.classList.add("js-menu");
    menuButton.hidden = !mobile.matches;
    setMenu(false);
  };
  syncMenu();
  mobile.addEventListener("change", syncMenu);
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  document
    .querySelectorAll(".site-header a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Photographs stay inside an edge-to-edge gallery. No image-file links.
  const gallery = document.querySelector(".photo-dialog");
  const galleryImage = document.querySelector("#gallery-image");
  let galleryIndex = 0;
  let galleryPhotos = [];
  let galleryOpener;
  const showPhoto = (index) => {
    galleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[galleryIndex];
    galleryImage.src = `img/photography/${photo.id}.webp`;
    galleryImage.alt = photo.alt;
    galleryImage.width = photo.width;
    galleryImage.height = photo.height;
    document.querySelector("#photo-title").textContent = photo.title;
    document.querySelector("#gallery-index").textContent =
      `${String(galleryIndex + 1).padStart(2, "0")} / ${String(galleryPhotos.length).padStart(2, "0")}`;
    document.querySelector("#gallery-announcement").textContent =
      `${photo.title} Fotografia ${galleryIndex + 1} di ${galleryPhotos.length}.`;
    document
      .querySelectorAll(".gallery-arrow")
      .forEach((button) => (button.hidden = galleryPhotos.length < 2));
  };
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo]");
    if (!button) return;
    galleryOpener = button;
    galleryPhotos = [...visiblePhotos];
    showPhoto(
      galleryPhotos.findIndex((photo) => photo.id === button.dataset.photo),
    );
    if (typeof gallery.showModal === "function") gallery.showModal();
    else {
      gallery.setAttribute("open", "");
      gallery.setAttribute("aria-modal", "true");
    }
    document.body.classList.add("modal-open");
    document.querySelector(".gallery-close").focus();
  });
  const closeGallery = () => {
    if (typeof gallery.close === "function") gallery.close();
    else {
      gallery.removeAttribute("open");
      restoreGalleryFocus();
    }
  };
  const restoreGalleryFocus = () => {
    document.body.classList.remove("modal-open");
    // Let the dialog leave the top layer before restoring keyboard focus.
    requestAnimationFrame(() => galleryOpener?.focus({ preventScroll: true }));
  };
  gallery.addEventListener("close", restoreGalleryFocus);
  document
    .querySelector(".gallery-close")
    .addEventListener("click", closeGallery);
  document
    .querySelector(".gallery-prev")
    .addEventListener("click", () => showPhoto(galleryIndex - 1));
  document
    .querySelector(".gallery-next")
    .addEventListener("click", () => showPhoto(galleryIndex + 1));
  let swipeStart;
  galleryImage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" && event.isPrimary)
      swipeStart = { x: event.clientX, y: event.clientY };
  });
  galleryImage.addEventListener("pointerup", (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 60)
      showPhoto(galleryIndex + (dx < 0 ? 1 : -1));
    swipeStart = null;
  });
  galleryImage.addEventListener("pointercancel", () => (swipeStart = null));

  document.addEventListener("keydown", (event) => {
    if (gallery.open) {
      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key))
        event.preventDefault();
      if (event.key === "ArrowRight") showPhoto(galleryIndex + 1);
      if (event.key === "ArrowLeft") showPhoto(galleryIndex - 1);
      if (event.key === "Home") showPhoto(0);
      if (event.key === "End") showPhoto(galleryPhotos.length - 1);
      return;
    }
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuButton.focus();
    }
    if (
      event.key === "Tab" &&
      mobile.matches &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      const links = [...navigation.querySelectorAll("a")];
      if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        links.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });

  const perspectiveButton = document.querySelector(".perspective-button");
  const artwork = document.querySelector(".perspective-art");
  const messages = edition?.perspectiveMessages || [
    ["La stessa forma.", "Un’altra possibilità."],
    ["Le idee si incontrano.", "Nasce qualcosa di nuovo."],
    ["Cambia l’incastro.", "Si apre una strada."],
  ];
  let perspective = 0;
  const renderPerspective = () => {
    document
      .querySelector("#perspective-message")
      .replaceChildren(
        document.createTextNode(messages[perspective][0]),
        document.createElement("br"),
        document.createTextNode(messages[perspective][1]),
      );
    document.querySelector("#perspective-count").textContent =
      `0${perspective + 1} / 03`;
  };
  renderPerspective();
  perspectiveButton.hidden = false;
  perspectiveButton.addEventListener("click", () => {
    perspective = (perspective + 1) % messages.length;
    artwork.dataset.perspective = String(perspective);
    renderPerspective();
  });

  // One passive scroll listener, one queued frame, no scroll interception.
  const field = document.querySelector(".field-transition");
  const fieldSticky = field.querySelector(".field-sticky");
  const storyNav = field.querySelector(".field-story-nav");
  const storyButtons = [...storyNav.querySelectorAll("[data-scene-jump]")];
  const scenes = [...field.querySelectorAll(".field-panel")].map((element) => {
    const x = Number(element.dataset.worldX);
    const y = Number(element.dataset.worldY);
    element.style.setProperty("--world-x", `${x}px`);
    element.style.setProperty("--world-y", `${y}px`);
    return { element, x, y };
  });
  const sceneStops = [0.3, 0.51, 0.72, 0.94];
  const sceneWindows = [
    [0.195, 0.25, 0.35, 0.44],
    [0.38, 0.46, 0.56, 0.65],
    [0.59, 0.67, 0.77, 0.86],
    [0.8, 0.88, 1, 1.05],
  ];
  const positions = [
    "Al centro",
    "In basso, a destra",
    "Verso destra",
    "Ancora più in là",
  ];
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const mix = (from, to, amount) => from + (to - from) * amount;
  let activeScene = -1;
  const setActiveScene = (index) => {
    if (index === activeScene) return;
    activeScene = index;
    field.dataset.scene = scenes[index].element.dataset.scene;
    field.dataset.step = String(index);
    document.querySelector("#field-position").textContent = positions[index];
    storyButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  };
  storyButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const index = Number(button.dataset.sceneJump);
      const target =
        field.offsetTop +
        (field.offsetHeight - fieldSticky.clientHeight) * sceneStops[index];
      scrollTo({
        top: target,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    }),
  );
  const hero = document.querySelector(".hero");
  let frame;
  const updateScroll = () => {
    frame = null;
    if (reducedMotion.matches) return;
    const viewportHeight = fieldSticky.clientHeight;
    const viewportWidth = fieldSticky.clientWidth;
    const rect = field.getBoundingClientRect();
    if (rect.top < innerHeight * 1.2 && rect.bottom > -100) {
      const progress = clamp(
        -rect.top / Math.max(rect.height - viewportHeight, 1),
      );
      const expansion = smooth(progress / 0.16);
      const sceneZoom = viewportWidth / 380;
      const overviewZoom = (viewportWidth * 0.94) / 2400;
      const introZoom = sceneZoom * 0.7;
      const camera = [
        { at: 0, x: 0, y: 0, zoom: (viewportWidth * 0.33) / 2400 },
        { at: 0.16, x: 0, y: 0, zoom: overviewZoom },
        { at: 0.25, ...scenes[0], zoom: introZoom },
        { at: 0.35, ...scenes[0], zoom: introZoom },
        { at: 0.46, ...scenes[1], zoom: sceneZoom },
        { at: 0.56, ...scenes[1], zoom: sceneZoom },
        { at: 0.67, ...scenes[2], zoom: sceneZoom },
        { at: 0.77, ...scenes[2], zoom: sceneZoom },
        { at: 0.88, ...scenes[3], zoom: sceneZoom },
        { at: 1, ...scenes[3], zoom: sceneZoom },
      ];
      const right = camera.findIndex(
        (point, index) => index > 0 && progress <= point.at,
      );
      const next = camera[right < 0 ? camera.length - 1 : right];
      const previous =
        camera[Math.max(0, (right < 0 ? camera.length - 1 : right) - 1)];
      const travel = smooth(
        (progress - previous.at) / Math.max(next.at - previous.at, 0.001),
      );
      const zoom = mix(previous.zoom, next.zoom, travel);
      const focusX = mix(previous.x, next.x, travel);
      const focusY = mix(previous.y, next.y, travel);
      let strongestPanel = 0;
      scenes.forEach((scene, index) => {
        const [enter, entered, leave, left] = sceneWindows[index];
        const opacity =
          smooth((progress - enter) / (entered - enter)) *
          (1 - smooth((progress - leave) / (left - leave)));
        scene.element.style.setProperty("--scene-opacity", String(opacity));
        strongestPanel = Math.max(strongestPanel, opacity);
      });
      field.style.setProperty("--field-inset-x", `${34 * (1 - expansion)}%`);
      field.style.setProperty("--field-inset-y", `${32 * (1 - expansion)}%`);
      field.style.setProperty("--field-radius", `${220 * (1 - expansion)}px`);
      field.style.setProperty("--camera-x", `${-focusX * zoom}px`);
      field.style.setProperty("--camera-y", `${-focusY * zoom}px`);
      field.style.setProperty("--camera-zoom", String(zoom));
      field.style.setProperty("--camera-turn", `${-14 * (1 - expansion)}deg`);
      field.style.setProperty("--panel-inverse", String(1 / zoom));
      field.style.setProperty(
        "--pitch-opacity",
        String(0.75 - strongestPanel * 0.58),
      );
      field.style.setProperty(
        "--field-lead",
        String(1 - smooth(progress / 0.14)),
      );
      field.style.setProperty(
        "--field-hud",
        String(smooth((progress - 0.16) / 0.06)),
      );
      field.style.setProperty("--field-progress", String(progress));
      field.dataset.dark = String(progress > 0.13);
      storyNav.hidden = progress < 0.22;
      setActiveScene(
        progress < 0.41 ? 0 : progress < 0.62 ? 1 : progress < 0.83 ? 2 : 3,
      );
    }
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom > 0) {
      const progress = clamp(-heroRect.top / heroRect.height);
      hero.style.setProperty("--hero-photo-y", `${-progress * 60}px`);
      hero.style.setProperty("--hero-type-y", `${progress * 35}px`);
    }
  };
  const requestScroll = () => {
    if (!frame && !reducedMotion.matches)
      frame = requestAnimationFrame(updateScroll);
  };
  const syncMotion = () => {
    document.documentElement.classList.toggle(
      "scroll-driven",
      !reducedMotion.matches,
    );
    if (reducedMotion.matches) {
      if (frame) cancelAnimationFrame(frame);
      frame = null;
      field.removeAttribute("style");
      storyNav.hidden = true;
      hero.style.removeProperty("--hero-photo-y");
      hero.style.removeProperty("--hero-type-y");
      document.documentElement.classList.remove("motion-ready");
      revealObserver?.disconnect();
      revealObserver = undefined;
      observeReveals();
    } else requestScroll();
  };
  syncMotion();
  reducedMotion.addEventListener("change", syncMotion);
  addEventListener("scroll", requestScroll, { passive: true });
  addEventListener("resize", requestScroll, { passive: true });
  addEventListener("pageshow", requestScroll);
  document.querySelector("#year").textContent = String(
    new Date().getFullYear(),
  );
})();
