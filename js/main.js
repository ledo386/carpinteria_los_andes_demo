(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Navegación móvil.
  const menuToggle = $('#menu-toggle');
  const mainNav = $('#main-nav');
  const closeMenu = () => {
    mainNav?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menú');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  $('a', mainNav).forEach(a => a.addEventListener('click', closeMenu));
  $('.site-header .brand')?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (mainNav?.classList.contains('is-open') && !e.target.closest('.site-header')) closeMenu();
  });

  // Animaciones de aparición; contenido visible si no hay soporte.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('shown'); revealObserver.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else revealItems.forEach(el => el.classList.add('shown'));

  // Filtros del portfolio.
  const filterButtons = $$('.filter');
  const projectCards = $$('.project-card');
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    const category = btn.dataset.filter;
    filterButtons.forEach(other => {
      const selected = other === btn;
      other.classList.toggle('active', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => { card.hidden = category !== 'todos' && card.dataset.category !== category; });
  }));

  // Ventana de detalles de imágenes de referencia.
  const modal = $('#project-modal');
  const modalImg = $('#modal-img');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const portfolio = projectCards.map(card => ({
    title: $('strong', card)?.textContent?.trim() || 'Inspiración en madera',
    image: $('img', card)?.src || '',
    alt: $('img', card)?.alt || 'Fotografía de inspiración',
    description: 'Imagen de inspiración para ilustrar posibilidades de diseño y carpintería. No representa un proyecto realizado por Carpintería Los Andes.'
  }));
  let activeProjectIndex = 0;
  let lastFocusedCard = null;
  const fillModal = index => {
    activeProjectIndex = (index + portfolio.length) % portfolio.length;
    const data = portfolio[activeProjectIndex];
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalImg.src = data.image;
    modalImg.alt = data.alt;
  };
  projectCards.forEach(card => card.addEventListener('click', () => {
    lastFocusedCard = card;
    fillModal(Number(card.dataset.index));
    if (typeof modal.showModal === 'function') modal.showModal();
  }));
  $('.modal-close')?.addEventListener('click', () => modal.close());
  $('#modal-prev')?.addEventListener('click', () => fillModal(activeProjectIndex - 1));
  $('#modal-next')?.addEventListener('click', () => fillModal(activeProjectIndex + 1));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal?.addEventListener('close', () => lastFocusedCard?.focus());
  modal?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') fillModal(activeProjectIndex - 1);
    if (e.key === 'ArrowRight') fillModal(activeProjectIndex + 1);
  });

  // Simulador de acabados (puramente visual).
  const finishNames = { roble: 'Roble natural', nogal: 'Nogal', blanco: 'Blanco cálido' };
  $$('.swatch').forEach(btn => btn.addEventListener('click', () => {
    const finish = btn.dataset.wood;
    $('#materials-preview').dataset.finish = finish;
    $('#selected-finish').textContent = finishNames[finish] || finish;
    $$('.swatch').forEach(other => {
      const selected = other === btn;
      other.classList.toggle('active', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
  }));

  // Preselección del servicio al elegir una tarjeta.
  $$('.service-card').forEach(card => card.addEventListener('click', () => {
    const serviceSelect = $('#service-select');
    if (serviceSelect) serviceSelect.value = card.dataset.service || '';
  }));

  // Formulario seguro de demo: valida, pero NUNCA almacena ni transmite datos.
  $('#quote-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const feedback = $('#form-feedback');
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    feedback.textContent = '✓ Ejemplo completado. En una web real, el mensaje podría llegar al negocio por un sistema de correo configurado y protegido. Aquí no se ha enviado ni guardado nada.';
    feedback.classList.add('is-success');
    form.reset();
  });

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
