(() => {
  'use strict';
  const header = document.querySelector('[data-site-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let previousFocus = null;
  let menuCloseTimer = null;
  const updateScrollState = () => { header?.classList.toggle('is-scrolled', scrollY > 16); document.body.classList.toggle('show-floating-actions', scrollY > Math.min(innerHeight * .65, 560)); };
  const closeMenu = (restoreFocus = true) => { if (!toggle || !menu || toggle.getAttribute('aria-expanded') === 'false') return; clearTimeout(menuCloseTimer); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'فتح القائمة'); header?.classList.remove('menu-active'); menu.classList.remove('is-open'); document.body.classList.remove('menu-open'); menuCloseTimer = setTimeout(() => { if (toggle.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, reducedMotion ? 0 : 250); if (restoreFocus) previousFocus?.focus(); };
  const openMenu = () => { if (!toggle || !menu) return; clearTimeout(menuCloseTimer); previousFocus = document.activeElement; menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'إغلاق القائمة'); header?.classList.add('menu-active'); document.body.classList.add('menu-open'); };
  updateScrollState();
  addEventListener('scroll', updateScrollState, { passive: true });
  toggle?.addEventListener('click', () => toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu());
  menu?.addEventListener('click', event => { if (event.target === menu || event.target.closest('a')) closeMenu(false); });
  document.addEventListener('pointerdown', event => { if (toggle?.getAttribute('aria-expanded') === 'true' && header && !header.contains(event.target)) closeMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); if (event.key !== 'Tab' || !menu || menu.hidden) return; const links = [...menu.querySelectorAll('a, button')]; if (!links.length) return; if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); toggle?.focus(); } if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); toggle?.focus(); } });
  addEventListener('resize', () => { if (innerWidth > 1088) closeMenu(false); updateScrollState(); });
  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) revealItems.forEach(item => item.classList.add('is-visible'));
  else { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .12 }); revealItems.forEach(item => observer.observe(item)); }
  if ('IntersectionObserver' in window) {
    const blockedZones = new Set();
    const actionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? blockedZones.add(entry.target) : blockedZones.delete(entry.target));
      document.body.classList.toggle('suppress-floating-actions', blockedZones.size > 0);
    }, { threshold: .08 });
    document.querySelectorAll('.final-cta-section, .contact-band, .site-footer').forEach(section => actionObserver.observe(section));
  }
  document.querySelectorAll('[data-faq-button]').forEach(button => button.addEventListener('click', () => { const answer = document.getElementById(button.getAttribute('aria-controls')); const isOpen = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!isOpen)); if (answer) answer.hidden = isOpen; }));
  const galleryImages = [...document.querySelectorAll('.gallery-card img')];
  if (galleryImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'site-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'عرض الصورة بالحجم الكامل');
    lightbox.innerHTML = '<button class="site-lightbox-close" type="button" aria-label="إغلاق عرض الصورة">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.append(lightbox);
    const preview = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    const closeButton = lightbox.querySelector('button');
    let activeImage = null;
    const closeLightbox = () => { if (!lightbox.classList.contains('is-open')) return; lightbox.classList.remove('is-open'); document.body.classList.remove('lightbox-open'); activeImage?.focus(); };
    const openLightbox = image => { activeImage = image; preview.src = image.currentSrc || image.src; preview.alt = image.alt; caption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt; lightbox.classList.add('is-open'); document.body.classList.add('lightbox-open'); closeButton.focus(); };
    galleryImages.forEach(image => { image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', `تكبير الصورة: ${image.alt}`); image.addEventListener('click', () => openLightbox(image)); image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(image); } }); });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });
  }
  document.querySelectorAll('[data-current-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
})();
