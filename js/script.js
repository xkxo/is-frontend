document.documentElement.classList.add('js');

// Nav: background once scrolled
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
const setMenu = (open) => {
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = el.closest('.hero') ? `${i * 90}ms` : '0ms';
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

// Console: typewriter placeholder
const input = document.getElementById('need');
const examples = [
  'Our retail customer wants orders and ASNs over EDI…',
  'Get our invoices onto Peppol for an NHS trust…',
  'Connect our web shop orders to Sage…',
  'Automate delivery schedules from our carmaker customer…',
];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  input.placeholder = examples[0];
} else {
  let ex = 0, ch = 0, deleting = false;
  const tick = () => {
    const text = examples[ex];
    ch += deleting ? -1 : 1;
    input.placeholder = text.slice(0, ch);

    let delay = deleting ? 22 : 45;
    if (!deleting && ch === text.length) { deleting = true; delay = 2200; }
    else if (deleting && ch === 0) { deleting = false; ex = (ex + 1) % examples.length; delay = 400; }
    setTimeout(tick, delay);
  };
  tick();
}

// Console submit: carry the message into the email CTA and jump to contact
const emailCta = document.getElementById('email-cta');
document.getElementById('console').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  const base = `mailto:enquiries@infosurge.co.uk?subject=${encodeURIComponent('Free 30-minute consultation')}`;
  emailCta.href = msg ? `${base}&body=${encodeURIComponent(msg)}` : base;
  document.getElementById('contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});

// Live demo window: loads the demo in an iframe on top of the page
const modal = document.getElementById('demo-modal');
const frameWrap = modal.querySelector('.demo-frame');
const iframe = document.getElementById('demo-iframe');
const modalTitle = document.getElementById('demo-modal-title');
const newTab = document.getElementById('demo-newtab');
let lastTrigger = null;

iframe.addEventListener('load', () => {
  if (iframe.getAttribute('src')) frameWrap.classList.add('loaded');
});

const openDemo = (src, title, trigger) => {
  lastTrigger = trigger;
  modalTitle.textContent = title;
  iframe.title = `${title} (live demo)`;
  newTab.href = src;
  frameWrap.classList.remove('loaded');
  iframe.src = src;
  modal.hidden = false;
  document.body.classList.add('demo-open');
  modal.querySelector('.demo-bar-btn[data-demo-close]').focus();
};

const closeDemo = () => {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('demo-open');
  iframe.removeAttribute('src');
  frameWrap.classList.remove('loaded');
  if (lastTrigger) lastTrigger.focus();
};

document.querySelectorAll('[data-demo]').forEach((btn) => {
  btn.addEventListener('click', () => openDemo(btn.dataset.demo, btn.dataset.demoTitle, btn));
});
modal.querySelectorAll('[data-demo-close]').forEach((el) => el.addEventListener('click', closeDemo));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDemo();
});
window.addEventListener('message', (e) => {
  if (e.source === iframe.contentWindow && e.data === 'demo:close') closeDemo();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
