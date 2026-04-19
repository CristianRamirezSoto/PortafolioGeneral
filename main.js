document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;

  const modeBtn = document.getElementById('modo-btn');
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-link');
  const btnSubir = document.getElementById('btnSubir');

  const btnCert = document.getElementById('btnCertificados');
  const modalCert = document.getElementById('modalCertificados');
  const modalCloseButtons = modalCert?.querySelectorAll('[data-close="cert"]') || [];

  const installBtn = document.getElementById('btnInstalar');
  const copyEmailBtn = document.getElementById('copyEmail');
  const yearNow = document.getElementById('yearNow');

  let deferredPrompt = null;
  let lastFocusedElement = null;

  const syncHeaderHeight = () => {
    const header = document.querySelector('.navbar');
    if (!header) return;
    root.style.setProperty('--header-h', `${header.offsetHeight}px`);
  };

  const setMenuState = (open) => {
    if (!navLinks || !menuBtn) return;
    navLinks.classList.toggle('active', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open && window.innerWidth <= 768);
  };

  if (yearNow) {
    yearNow.textContent = String(new Date().getFullYear());
  }

  const applyThemeLabel = () => {
    if (!modeBtn) return;
    const isDark = body.classList.contains('dark');
    modeBtn.innerHTML = isDark
      ? '<i class="fas fa-moon"></i><span>Oscuro</span>'
      : '<i class="fas fa-sun"></i><span>Claro</span>';
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }
  applyThemeLabel();

  modeBtn?.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    applyThemeLabel();
  });

  menuBtn?.addEventListener('click', () => {
    if (!navLinks) return;
    const isOpen = !navLinks.classList.contains('active');
    setMenuState(isOpen);
  });

  document.addEventListener('click', (event) => {
    if (!navLinks || !menuBtn) return;
    if (window.innerWidth > 768) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!navLinks.contains(target) && !menuBtn.contains(target)) {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    syncHeaderHeight();

    if (!navLinks || !menuBtn) return;
    if (window.innerWidth > 768) {
      setMenuState(false);
    }
  });

  window.addEventListener('orientationchange', syncHeaderHeight);

  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  const toggleScrollButton = () => {
    if (!btnSubir) return;
    btnSubir.classList.toggle('visible', window.scrollY > 320);
  };

  window.addEventListener('scroll', toggleScrollButton);
  toggleScrollButton();

  btnSubir?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const revealNodes = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('visible'));
  }

  const sectionNodes = document.querySelectorAll('[data-section]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        });
      },
      { threshold: 0.35, rootMargin: '-20% 0px -40% 0px' }
    );

    sectionNodes.forEach((section) => navObserver.observe(section));
  }

  const openModal = () => {
    if (!modalCert) return;
    setMenuState(false);
    lastFocusedElement = document.activeElement;
    modalCert.classList.remove('hidden');
    modalCert.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');

    const firstButton = modalCert.querySelector('.modal-close');
    firstButton?.focus();
  };

  const closeModal = () => {
    if (!modalCert) return;
    modalCert.classList.add('hidden');
    modalCert.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  btnCert?.addEventListener('click', openModal);
  modalCloseButtons.forEach((el) => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalCert && !modalCert.classList.contains('hidden')) {
      closeModal();
    }
  });

  copyEmailBtn?.addEventListener('click', async () => {
    const email = 'cristianramirezsoto2003@gmail.com';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i> Correo copiado';
      } else {
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-circle-info"></i> Copia manual: ' + email;
      }
    } catch {
      copyEmailBtn.innerHTML = '<i class="fa-solid fa-circle-info"></i> Copia manual: ' + email;
    }

    setTimeout(() => {
      copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar correo';
    }, 2200);
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.style.display = 'none';
  });

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone;

  if (isStandalone) {
    installBtn?.remove();
    document.querySelector('.btn-flotante')?.remove();
  }

  syncHeaderHeight();
  setMenuState(false);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Se ignora en entornos sin soporte o con restricciones de cache.
    });
  }
});
