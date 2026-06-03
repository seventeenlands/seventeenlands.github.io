(() => {
  class ManaPip extends HTMLElement {
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;
      const color = this.tagName.toLowerCase().slice(2);
      const i = document.createElement('i');
      i.className = 'ms ms-' + color + ' ms-cost';
      if (this.hasAttribute('splash')) i.style.fontSize = '.7em';
      this.appendChild(i);
    }
  }

  const tags = [
    'w', 'u', 'b', 'r', 'g',
    'wu', 'wb', 'ub', 'ur', 'br', 'bg', 'rg', 'rw', 'gw', 'gu',
    'wubrg',
  ];

  tags.forEach((tag) => {
    customElements.define('p-' + tag, class extends ManaPip {});
  });
})();
