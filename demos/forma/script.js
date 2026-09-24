(() => {
  'use strict';
  const t = value => window.portfolioTranslate?.(value) ?? value;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  // Asset paths are explicit so photography can be replaced independently of the UI.
  const configurations = {
    compact: { name: 'Compact', price: 149900, size: '180 × 96 × 76', index: '01', images: { sand: 'assets/compact-sand.webp', moss: 'assets/compact-moss.webp', graphite: 'assets/compact-graphite.webp', clay: 'assets/compact-clay.webp' } },
    classic: { name: 'Classic', price: 189900, size: '260 × 96 × 76', index: '02', images: { sand: 'assets/classic-sand.webp', moss: 'assets/classic-moss.webp', graphite: 'assets/classic-graphite.webp', clay: 'assets/classic-clay.webp' } },
    corner: { name: 'Corner', price: 239900, size: '260 × 166 × 76', index: '03', images: { sand: 'assets/corner-sand.webp', moss: 'assets/corner-moss.webp', graphite: 'assets/corner-graphite.webp', clay: 'assets/corner-clay.webp' } }
  };
  const fabrics = {
    sand: { name: 'Sand', extra: 0, description: 'Sand — тёплый песочный, фактурное плетение.' },
    moss: { name: 'Moss', extra: 6000, description: 'Moss — приглушённый оливковый, фактурное плетение.' },
    graphite: { name: 'Graphite', extra: 6000, description: 'Graphite — глубокий серый, фактурное плетение.' },
    clay: { name: 'Clay', extra: 9000, description: 'Clay — мягкая терракота, фактурное плетение.' }
  };
  const stage = document.querySelector('#product-stage');
  const price = document.querySelector('#price');
  const status = document.querySelector('#config-status');
  const form = document.querySelector('#order-form');
  const formStatus = document.querySelector('#form-status');
  const summary = document.querySelector('#order-summary');
  const cache = new Map();
  let desired = { configuration: 'classic', fabric: 'sand' };
  let committed = { ...desired };
  let request = 0;
  let priceFrame;
  let displayedPrice = 189900;
  let liveSummary = '';
  const money = value => `${Math.round(value).toLocaleString(document.documentElement.lang === 'en' ? 'en-GB' : 'ru-RU')} ₽`;

  function loadImage(src) {
    if (!cache.has(src)) {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      const ready = image.decode().then(() => image).catch(error => { cache.delete(src); throw error; });
      cache.set(src, ready);
    }
    return cache.get(src);
  }

  function animatePrice(target) {
    cancelAnimationFrame(priceFrame);
    const start = displayedPrice;
    const began = performance.now();
    const frame = now => {
      const progress = motion.matches ? 1 : Math.min(1, (now - began) / 420);
      displayedPrice = start + (target - start) * (1 - (1 - progress) ** 3);
      price.textContent = money(displayedPrice);
      if (progress < 1) priceFrame = requestAnimationFrame(frame);
    };
    frame(began);
  }

  function updateSummary(state, announce = true) {
    const config = configurations[state.configuration];
    const fabric = fabrics[state.fabric];
    const total = config.price + fabric.extra;
    liveSummary = `M1 · ${config.name} · ${fabric.name} · ${money(total)}`;
    document.querySelector('#selection').textContent = `${config.name} / ${fabric.name}`;
    document.querySelector('#dimension').textContent = `${config.size} ${t('см')}`;
    document.querySelector('#product-index').textContent = `${config.index} / 03`;
    document.querySelector('#fabric-description').textContent = t(fabric.description);
    summary.textContent = liveSummary;
    if (announce) status.textContent = `${t('Выбрано:')} ${liveSummary}`;
    animatePrice(total);
  }

  async function select(next) {
    desired = { ...next };
    const ticket = ++request;
    stage.setAttribute('aria-busy', 'true');
    formStatus.textContent = '';
    const config = configurations[next.configuration];
    const src = config.images[next.fabric];
    try {
      await loadImage(src);
      if (ticket !== request) return;
      const current = stage.querySelector('.is-current');
      if (current.getAttribute('src') !== src) {
        const incoming = new Image(1200, 800);
        incoming.src = src;
        incoming.alt = `${t('Модульный диван FORMA M1')} · ${config.name} · ${fabrics[next.fabric].name}`;
        incoming.className = 'product-layer';
        stage.append(incoming);
        // Commit the starting style before crossfading the two decoded layers.
        void incoming.offsetWidth;
        current.classList.remove('is-current');
        current.classList.add('is-leaving');
        current.alt = '';
        current.setAttribute('aria-hidden', 'true');
        incoming.classList.add('is-current');
        setTimeout(() => current.remove(), motion.matches ? 0 : 450);
      }
      committed = { ...next };
      updateSummary(next);
      preloadNeighbours(next);
    } catch (_) {
      if (ticket !== request) return;
      desired = { ...committed };
      document.querySelector(`[name="configuration"][value="${committed.configuration}"]`).checked = true;
      document.querySelector(`[name="fabric"][value="${committed.fabric}"]`).checked = true;
      status.textContent = t('Не удалось загрузить изображение. Сохранён предыдущий вариант. Попробуйте ещё раз.');
    } finally {
      if (ticket === request) stage.setAttribute('aria-busy', 'false');
    }
  }

  function idle(callback) {
    if ('requestIdleCallback' in window) requestIdleCallback(callback, { timeout: 1800 });
    else setTimeout(callback, 200);
  }
  function preloadNeighbours(state) {
    if (navigator.connection?.saveData || /2g/.test(navigator.connection?.effectiveType || '')) return;
    const urls = [...Object.values(configurations[state.configuration].images), ...Object.values(configurations).map(config => config.images[state.fabric])];
    idle(async () => {
      for (const url of new Set(urls)) {
        // A failed background preload can be retried by a later explicit selection.
        try { await loadImage(url); } catch (_) { /* Keep the current product visible. */ }
      }
    });
  }
  const preloadObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      preloadNeighbours(desired);
      preloadObserver.disconnect();
    }
  }, { rootMargin: '500px' });
  preloadObserver.observe(stage);

  document.querySelectorAll('[name="configuration"], [name="fabric"]').forEach(input => {
    input.addEventListener('change', () => select({ ...desired, [input.name]: input.value }));
  });
  document.querySelectorAll('[data-choose]').forEach(link => link.addEventListener('click', () => {
    const configuration = link.dataset.choose;
    document.querySelector(`[name="configuration"][value="${configuration}"]`).checked = true;
    select({ ...desired, configuration });
  }));

  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navigation');
  const mobile = matchMedia('(max-width: 800px)');
  function setMenu(open, restoreFocus = false) {
    menu.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
    nav.inert = mobile.matches && !open;
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target) && menu.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  header.addEventListener('focusout', () => {
    setTimeout(() => { if (!header.contains(document.activeElement)) setMenu(false); }, 0);
  });
  mobile.addEventListener('change', () => setMenu(false));
  setMenu(false);

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('is-pending');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (!motion.matches) element.classList.add('is-pending');
    revealObserver.observe(element);
  });
  const parallaxImages = [...document.querySelectorAll('.parallax-image')];
  let scrollFrame = 0;
  function onScroll() {
    scrollFrame = 0;
    header.classList.toggle('is-scrolled', scrollY > 40);
    for (const image of parallaxImages) {
      if (motion.matches || mobile.matches) { image.style.removeProperty('--parallax'); continue; }
      const rect = image.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        const offset = Math.max(-12, Math.min(12, (rect.top + rect.height / 2 - innerHeight / 2) * .025));
        image.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
      }
    }
  }
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', onScroll);
  motion.addEventListener('change', () => {
    if (motion.matches) document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
    onScroll();
  });
  onScroll();

  document.querySelectorAll('[data-model]').forEach(link => link.addEventListener('click', () => {
    formStatus.textContent = '';
    summary.textContent = `${link.dataset.model} · ${t('Консультация по модели')}`;
  }));
  document.querySelector('[data-samples]').addEventListener('click', () => {
    formStatus.textContent = '';
    summary.textContent = `${t('Образцы тканей')} · Sand / Moss / Graphite / Clay`;
  });
  document.querySelector('.config-controls>.button').addEventListener('click', () => {
    formStatus.textContent = '';
    summary.textContent = liveSummary;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    formStatus.textContent = t('Готово! В реальном проекте мы бы связались с вами для расчёта. Это демо: заявка и личные данные никуда не отправлены.');
    formStatus.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  form.addEventListener('input', () => { formStatus.textContent = ''; });
  updateSummary(committed, false);
})();
