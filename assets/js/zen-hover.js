// Easter egg: hover/focus/tap a `.zen-hover` element to reveal The Zen of Python.

(function () {
  const ZEN = `The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!`;

  function init() {
    const targets = document.querySelectorAll('.zen-hover');
    if (!targets.length) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'zen-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent = ZEN;
    document.body.appendChild(tooltip);

    let current = null;

    function position(el) {
      const rect = el.getBoundingClientRect();
      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;
      const vw = window.innerWidth;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let left = rect.left + scrollX + rect.width / 2 - tw / 2;
      let top = rect.top + scrollY - th - 12;

      if (top < scrollY + 8) {
        top = rect.bottom + scrollY + 12;
      }
      if (left < scrollX + 8) left = scrollX + 8;
      if (left + tw > scrollX + vw - 8) left = scrollX + vw - tw - 8;

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }

    function show(el) {
      current = el;
      tooltip.classList.add('zen-tooltip-visible');
      position(el);
    }

    function hide() {
      current = null;
      tooltip.classList.remove('zen-tooltip-visible');
    }

    targets.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('mouseenter', () => show(el));
      el.addEventListener('mouseleave', hide);
      el.addEventListener('focus', () => show(el));
      el.addEventListener('blur', hide);
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (current === el) {
          hide();
        } else {
          show(el);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (current && !current.contains(e.target) && !tooltip.contains(e.target)) {
        hide();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && current) hide();
    });

    window.addEventListener('scroll', () => { if (current) position(current); }, { passive: true });
    window.addEventListener('resize', () => { if (current) position(current); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
