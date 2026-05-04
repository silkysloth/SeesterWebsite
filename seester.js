/* ── HAMBURGER MENU (injected on mobile) ── */
const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav-links');

if (nav && navLinks) {
  // Build hamburger button
  const burger = document.createElement('button');
  burger.className = 'nav-hamburger';
  burger.setAttribute('aria-label', 'Menu');
  burger.innerHTML = '<span></span><span></span><span></span>';

  // Build mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav-mobile-menu';

  // Copy links from desktop nav into mobile menu
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    if (link.classList.contains('nav-cta')) a.classList.add('mob-cta');
    mobileMenu.appendChild(a);
  });

  nav.appendChild(burger);
  document.body.insertBefore(mobileMenu, nav.nextSibling);

  // Toggle open/close
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}


/* ── SCROLL FADE-IN ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


/* ── CONTACT FORM ── */
const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    if (name && !name.value.trim()) { showToast('Vul asseblief jou naam in.', 'error'); return; }
    if (email && !isValidEmail(email.value.trim())) { showToast('Voer asseblief \'n geldige e-posadres in.', 'error'); return; }
    if (message && !message.value.trim()) { showToast('Skryf asseblief \'n boodskap.', 'error'); return; }

    const originalHTML = btn.innerHTML;
    btn.textContent = 'Stuur...';
    btn.disabled = true;

    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        showToast('Dankie! Ons sal binnekort kontak maak. 🙏', 'success');
        form.reset();
      } else {
        showToast('Iets het verkeerd gegaan. Probeer asseblief weer.', 'error');
      }
    })
    .catch(() => {
      showToast('Geen verbinding. Probeer asseblief weer.', 'error');
    })
    .finally(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '1rem',
    left: '1rem',
    background: type === 'success' ? '#d4527a' : '#8c3d22',
    color: '#fff',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.88rem',
    fontWeight: '500',
    letterSpacing: '0.04em',
    padding: '1rem 1.5rem',
    borderRadius: '3px',
    zIndex: '9999',
    opacity: '0',
    transform: 'translateY(12px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    textAlign: 'center',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}


/* ── STICKY NAV SHADOW ON SCROLL ── */
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20 ? '0 2px 24px rgba(0,0,0,0.4)' : 'none';
});


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});