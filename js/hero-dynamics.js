const heroPhrases = [
  "un design pulito",
  "un codice ordinato",
  "logica e semplicità",
  "spazi da esplorare"
];

const colorSchemes = [
  { primary: '#7d5cff', secondary: '#30d7d0', accent: '#f8c651' },
  { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#ffe66d' },
  { primary: '#a8e6cf', secondary: '#ffd3a5', accent: '#ffaaa5' },
  { primary: '#dcedc8', secondary: '#f8cecc', accent: '#f8bbd9' },
  { primary: '#b3e5fc', secondary: '#c8e6c9', accent: '#fff9c4' }
];

const heroImages = [
  'img/hero/alba.jpg',
  'img/hero/ponte.webp',
  'img/hero/architettura.jpg',
  'img/hero/natura-morta.jpg',
  'img/hero/paesaggio.jpg'
];

const projects = [
  {
    img: 'img/foto/Rifugio-pomilio.jpg',
    title: 'Spazi logici',
    text: 'Costruire un percorso sensato. Progetti pensati per essere usati facilmente.'
  },
  {
    img: 'img/foto/Francavilla-al-mare.jpg',
    title: 'Linguaggio visivo chiaro',
    text: 'Ogni elemento aiuta chi naviga a trovare subito quello che cerca.'
  },
  {
    img: 'img/foto/salto.jpg',
    title: 'Gerarchie pulite',
    text: 'Dare la giusta priorità agli elementi, senza sovrapposizioni inutili.'
  },
  {
    img: 'img/hero/architettura.jpg',
    title: 'Forma e sostanza',
    text: 'Do forma a idee e contenuti in modo che siano leggibili e accessibili.'
  },
  {
    img: 'img/hero/paesaggio.jpg',
    title: 'Percorsi fluidi',
    text: 'Semplificare l\'esperienza utente, un passo alla volta.'
  }
];

const sectionTexts = {
  'chi-sono': [
    "Cerco il senso logico delle cose, nel codice e nel design.",
    "Mi piace ascoltare e costruire le cose un pezzo alla volta.",
    "Un approccio pragmatico, senza effetti speciali inutili."
  ],
  'competenze': [
    "Cosa faccio in pratica, ogni giorno.",
    "Dalla struttura visiva al codice che la fa funzionare.",
    "Grafica e front-end per dare forma a idee concrete."
  ],
  'forza': [
    "Come mi muovo nei progetti, tra metodo e tranquillità.",
    "Faccio le cose con ordine, partendo dalle basi.",
    "Affronto i problemi tecnici un passo alla volta."
  ]
};

const competenceItems = [
  {
    badge: '01',
    title: 'Struttura chiara',
    text: 'Organizzo ogni pagina con una gerarchia semplice e un percorso intuitivo.'
  },
  {
    badge: '02',
    title: 'Contenuti essenziali',
    text: 'Scelgo le parole e gli elementi giusti, così il messaggio resta leggibile.'
  },
  {
    badge: '03',
    title: 'Coerenza visiva',
    text: 'Creo uno stile armonico che mette ordine senza complicare.'
  },
  {
    badge: '04',
    title: 'Codice affidabile',
    text: 'Sviluppo con attenzione a manutenzione, accessibilità e prestazioni.'
  },
  {
    badge: '05',
    title: 'Collaborazione efficace',
    text: 'Gestisco il lavoro in modo chiaro per ridurre attriti e semplificare.'
  }
];

function setHeroBackground() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  const image = heroImages[Math.floor(Math.random() * heroImages.length)];
  hero.style.backgroundImage = `linear-gradient(rgba(8, 12, 28, 0.48), rgba(8, 12, 28, 0.48)), url(${image})`;
}

function randomizeColorScheme() {
  const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  document.documentElement.style.setProperty('--primary', scheme.primary);
  document.documentElement.style.setProperty('--secondary', scheme.secondary);
  document.documentElement.style.setProperty('--accent', scheme.accent);
}

function animateHeroTyping() {
  const textEl = document.querySelector('.typed-text');
  const cursor = document.querySelector('.typed-cursor');
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  if (!textEl || !cursor) return;

  function updateText() {
    const current = heroPhrases[phraseIndex];
    textEl.textContent = current.slice(0, charIndex);
    cursor.classList.toggle('typing', !deleting);
    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      setTimeout(updateText, 140);
    } else if (!deleting) {
      deleting = true;
      textEl.classList.add('deleting');
      setTimeout(updateText, 2800);
    } else if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(updateText, 90);
    } else {
      deleting = false;
      textEl.classList.remove('deleting');
      phraseIndex = (phraseIndex + 1) % heroPhrases.length;
      setTimeout(updateText, 520);
    }
  }

  updateText();
}

function displayRandomProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;
  const shuffled = [...projects].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  container.innerHTML = selected.map((project, index) => `
    <div class="col-md-4">
      <div class="card shadow-sm border-0 h-100 text-dark project-card fade-in delay-${index + 1}">
        <img src="${project.img}" class="card-img-top" alt="${project.title}" loading="lazy">
        <div class="card-body">
          <h5 class="card-title">${project.title}</h5>
          <p class="card-text">${project.text}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function animateSkillBadges() {
  document.querySelectorAll('.skill-badges span').forEach((badge, index) => {
    setTimeout(() => {
      badge.classList.add('active');
    }, 120 + index * 90);
  });
}

function renderCompetenceCards() {
  const shell = document.getElementById('competence-shell');
  if (!shell) return;

  const shuffled = [...competenceItems].sort(() => 0.5 - Math.random());
  shell.innerHTML = shuffled.map(item => `
    <article class="competence-card">
      <h5>${item.title}</h5>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function animateCyclingText() {
  const element = document.querySelector('.cycling-text');
  if (!element) return;

  const texts = element.dataset.texts.split('|');
  let index = 0;

  function cycleText() {
    element.classList.add('exploding');
    setTimeout(() => {
      element.textContent = texts[index];
      element.classList.remove('exploding');
      element.classList.add('appearing');
      setTimeout(() => {
        element.classList.remove('appearing');
      }, 500);
      index = (index + 1) % texts.length;
    }, 600);
  }

  cycleText();
  setInterval(cycleText, 5000);
}

function initDraggableShell(shellId) {
  const shell = document.getElementById(shellId);
  if (!shell) return;

  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  function endDrag() {
    isDragging = false;
    shell.classList.remove('dragging');
  }

  shell.addEventListener('pointerdown', (event) => {
    isDragging = true;
    shell.setPointerCapture(event.pointerId);
    startX = event.pageX - shell.offsetLeft;
    scrollStart = shell.scrollLeft;
    shell.classList.add('dragging');
  });

  shell.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - shell.offsetLeft;
    const walk = x - startX;
    shell.scrollLeft = scrollStart - walk;
  });

  shell.addEventListener('pointerup', endDrag);
  shell.addEventListener('pointercancel', endDrag);
  shell.addEventListener('pointerleave', endDrag);

  shell.addEventListener('wheel', (e) => {
    const maxScroll = shell.scrollWidth - shell.clientWidth;
    if (maxScroll <= 0) return;

    const section = shell.closest('section');
    const rect = section ? section.getBoundingClientRect() : null;
    if (!section || !rect) return;

    const canScrollRight = e.deltaY > 0 && shell.scrollLeft + shell.clientWidth < shell.scrollWidth - 1;
    const canScrollLeft = e.deltaY < 0 && shell.scrollLeft > 1;

    if (canScrollRight || canScrollLeft) {
      e.preventDefault();
      shell.scrollBy({ left: e.deltaY * 1.4, behavior: 'smooth' });
    }
  }, { passive: false });
}

function syncCompetenceScrollWithPage() {
  const section = document.getElementById('competenze');
  const shell = document.getElementById('competence-shell');
  if (!section || !shell) return;

  let ticking = false;

  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScroll = windowHeight + rect.height;
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / totalScroll));
    const maxLeft = shell.scrollWidth - shell.clientWidth;
    if (maxLeft > 0) {
      shell.scrollLeft = maxLeft * progress;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScroll);
    }
  });

  updateScroll();
}

function addFadeInAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .info-box, .skill-card, .card, .section-heading').forEach(el => {
    observer.observe(el);
  });
}

function randomizeSectionTexts() {
  Object.keys(sectionTexts).forEach(sectionId => {
    const heading = document.querySelector(`#${sectionId} .section-heading h2`);
    if (heading) {
      const texts = sectionTexts[sectionId];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      heading.textContent = randomText;
    }
  });
}

function addParallaxEffect() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

function addScrollZoomAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.scroll-zoom').forEach(el => observer.observe(el));
}

function setupFieldZoomScroll() {
    const section = document.getElementById('campo');
    const frame = document.getElementById('field-frame');
    const innerContent = document.getElementById('field-copy');
    
    // Controllo di esistenza
    if (!section || !frame || !innerContent) {
        console.error("Errore Strutturale: Elementi del campo mancanti nel DOM.");
        return;
    }

    let ticking = false;

    function updateZoom() {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 1. Calcolo dello spazio di scroll con protezione (evita divisioni per zero)
        let scrollableHeight = rect.height - windowHeight;
        if (scrollableHeight <= 0) scrollableHeight = 1; 
        
        let progress = 0;
        
        // 2. Calcoliamo il progresso solo se stiamo toccando o oltrepassando l'inizio della sezione
        if (rect.top <= 0) {
            progress = Math.abs(rect.top) / scrollableHeight;
            // Normalizziamo tassativamente il valore tra 0 e 1
            if (progress > 1) progress = 1;
            if (progress < 0 || isNaN(progress)) progress = 0; 
        }

        // 3. Calcoli di interpolazione
        const minScale = 1;
        const maxScale = 60; 
        const currentScale = minScale + (maxScale - minScale) * Math.pow(progress, 3);
        const currentRadius = 120 * (1 - Math.min(progress * 2, 1));

        // 4. Applicazione diretta
        frame.style.transform = `scale(${currentScale})`;
        frame.style.borderRadius = `${currentRadius}px`;

        // 5. Gestione visibilità testo indipendente
        // Iniziamo a mostrare il testo quando lo zoom è a buon punto (es. superato il 30% dello scroll)
        let textOpacity = 0;
        let translateY = 30; // Partenza: 30px più in basso
        
        if (progress > 0.3) {
            // Calcolo lineare da 0 a 1 per l'opacità
            textOpacity = Math.min((progress - 0.3) * 2.5, 1);
            // Il testo sale gradualmente verso la sua posizione originale
            translateY = 30 * (1 - textOpacity);
        }

        innerContent.style.opacity = textOpacity;
        // Combiniamo il translate fisso di centratura (-50%, -50%) con il movimento Y calcolato
        innerContent.style.transform = `translate(-50%, calc(-50% + ${translateY}px))`;

        ticking = false;
    }

    // Usiamo passività per non interferire con il framerate nativo del browser
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateZoom);
        }
    }, { passive: true });

    // Inizializzazione immediata
    updateZoom();
}

function addMobileShake() {
  if ('ontouchstart' in window) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('touchstart', () => {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 600);
      });
    });
  }
}

function setActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function update() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.id;
      const navLink = document.querySelector(`.navbar-nav .nav-link[href='#${id}']`);

      if (!navLink) return;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', update);
  update();
}

function enableSmoothScroll() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const collapseElement = document.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }

      if (collapseElement && collapseElement.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, {toggle: false});
        bsCollapse.hide();
      }
    });
  });
}

function initParticles() {
  if (typeof particlesJS === 'undefined') return;
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: '#FFFFFF' },
      shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
      opacity: { value: 0.7, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 170, color: '#FFFFFF', opacity: 0.15, width: 1 },
      move: { enable: true, speed: 2, direction: 'none', random: true }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: false },
        resize: true
      },
      modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } } }
    },
    retina_detect: true
  });
}

window.addEventListener('DOMContentLoaded', () => {
  randomizeColorScheme();
  setHeroBackground();
  animateHeroTyping();
  displayRandomProjects();
  animateSkillBadges();
  addFadeInAnimations();
  randomizeSectionTexts();
  addScrollZoomAnimations();
  renderCompetenceCards();
  initDraggableShell('competence-shell');
  syncCompetenceScrollWithPage();
  setupFieldZoomScroll();
  addParallaxEffect();
  addMobileShake();
  setActiveNav();
  enableSmoothScroll();
  initParticles();
  animateCyclingText();
});
