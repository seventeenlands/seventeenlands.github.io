(() => {
  const SCRYFALL_API = 'https://api.scryfall.com/cards/named?fuzzy=';
  const cache = new Map();
  const inflight = new Map();

  const STYLE = `
    .autocard-popup {
      position: fixed;
      width: 244px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.45);
      pointer-events: none;
      z-index: 9999;
      transition: opacity .12s ease-out;
      opacity: 0;
    }
    .autocard-popup.show { opacity: 1; }
    .autocard-popup img {
      width: 100%;
      display: block;
      border-radius: 12px;
    }
    .autocard-popup-split {
      width: 340px;
      height: 244px;
    }
    .autocard-popup-split img {
      position: absolute;
      width: 244px;
      height: 340px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  `;

  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function imageFromCard(card) {
    if (card.image_uris) return card.image_uris.normal;
    if (card.card_faces && card.card_faces[0].image_uris) return card.card_faces[0].image_uris.normal;
    return null;
  }

  function needsRotation(card) {
    return card && card.layout === 'split';
  }

  async function fetchCard(name) {
    if (cache.has(name)) return cache.get(name);
    if (inflight.has(name)) return inflight.get(name);
    const promise = fetch(SCRYFALL_API + encodeURIComponent(name))
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((data) => {
        cache.set(name, data);
        inflight.delete(name);
        return data;
      });
    inflight.set(name, promise);
    return promise;
  }

  function preloadImage(url) {
    if (!url) return Promise.resolve();
    const img = new Image();
    img.src = url;
    if (img.decode) return img.decode().catch(() => {});
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  }

  function precacheAll() {
    const names = [];
    const seen = new Set();
    document.querySelectorAll('scryfall-card').forEach((el) => {
      const a = el.querySelector('a');
      const name = (el.getAttribute('name') || (a ? a.textContent : el.textContent)).trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
    });
    let i = 0;
    async function worker() {
      while (i < names.length) {
        const name = names[i++];
        if (cache.has(name) || inflight.has(name)) continue;
        try {
          const card = await fetchCard(name);
          if (card) await preloadImage(imageFromCard(card));
        } catch (e) { /* ignore */ }
      }
    }
    const CONCURRENCY = 3;
    setTimeout(() => {
      for (let w = 0; w < CONCURRENCY; w++) worker();
    }, 100);
  }

  function positionPopup(popup, anchor) {
    const r = anchor.getBoundingClientRect();
    const popupH = popup.offsetHeight || 340;
    const popupW = popup.offsetWidth || 244;
    const margin = 8;
    let top = r.bottom + margin;
    if (top + popupH > window.innerHeight) top = r.top - popupH - margin;
    let left = r.left;
    if (left + popupW > window.innerWidth) left = window.innerWidth - popupW - margin;
    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

  class AutoCard extends HTMLElement {
    connectedCallback() {
      // Defer until parsed: during parsing child text isn't available yet, the DOMContentLoaded pass inits static cards.
      if (document.readyState === 'loading') return;
      this._init();
    }

    _init() {
      if (this._initialized) return;
      const display = this.textContent.trim();
      const name = (this.getAttribute('name') || display).trim();
      if (!name) return;
      const a = document.createElement('a');
      a.textContent = display || name;
      a.href = 'https://scryfall.com/search?q=' + encodeURIComponent('!"' + name + '"');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      this.textContent = '';
      this.appendChild(a);
      this._popup = null;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      if (hasHover) {
        a.addEventListener('mouseenter', () => this._onEnter(a, name));
        a.addEventListener('mouseleave', () => this._onLeave());
        a.addEventListener('focus', () => this._onEnter(a, name));
        a.addEventListener('blur', () => this._onLeave());
      }
      a.addEventListener('click', (e) => this._onClick(e, a, name));
      this._initialized = true;
    }

    _onClick(e, anchor, name) {
      if (window.matchMedia('(hover: hover)').matches) return;
      if (this._popup) return;
      e.preventDefault();
      this._onEnter(anchor, name);
    }

    async _onEnter(anchor, name) {
      const card = await fetchCard(name);
      if (!card) return;
      if (card.scryfall_uri) anchor.href = card.scryfall_uri;
      const img = imageFromCard(card);
      if (!img) return;
      if (this._popup) this._popup.remove();
      const popup = document.createElement('div');
      popup.className = 'autocard-popup';
      if (needsRotation(card)) popup.classList.add('autocard-popup-split');
      const el = document.createElement('img');
      el.src = img;
      el.alt = card.name || name;
      popup.appendChild(el);
      document.body.appendChild(popup);
      positionPopup(popup, anchor);
      requestAnimationFrame(() => popup.classList.add('show'));
      this._popup = popup;
    }

    _onLeave() {
      if (this._popup) {
        this._popup.remove();
        this._popup = null;
      }
    }
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(() => {
    injectStyle();
    document.querySelectorAll('scryfall-card').forEach((el) => el._init && el._init());
    document.addEventListener('click', (e) => {
      document.querySelectorAll('scryfall-card').forEach((el) => {
        if (el._popup && !el.contains(e.target)) el._onLeave();
      });
    });
    precacheAll();
  });
  customElements.define('scryfall-card', AutoCard);
})();
